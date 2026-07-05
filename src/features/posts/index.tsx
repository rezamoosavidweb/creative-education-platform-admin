import { useMemo, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Eye, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { useApiForm } from '@/lib/forms'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StatusPill } from '@/components/status-pill'
import {
  useCheckPostAccess,
  useCreatePost,
  useDeletePost,
  usePostDetail,
  usePosts,
} from './hooks/use-posts-queries'
import {
  createPostBody,
  filterPosts,
  formatPostDate,
  getPostDescription,
  getPosts,
  getPostTitle,
} from './services/posts-query'
import type { Post, PostsParams } from './types'

const postSchema = z.object({
  descriptionEn: z.string().trim().min(1).max(5000),
  descriptionRu: z.string().trim().max(5000).optional(),
  titleEn: z.string().trim().min(1).max(300),
  titleRu: z.string().trim().max(300).optional(),
})

export function Posts() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [detailPost, setDetailPost] = useState<Post | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null)
  const params = useMemo<PostsParams>(
    () => ({ order: 'DESC', page, take: 10 }),
    [page]
  )
  const postsQuery = usePosts(params)
  const deleteMutation = useDeletePost()
  const accessMutation = useCheckPostAccess()
  const posts = getPosts(postsQuery.data)
  const filteredPosts = useMemo(() => filterPosts(posts, query), [posts, query])
  const meta = postsQuery.data?.meta

  async function checkAccess(post: Post) {
    const promise = accessMutation.mutateAsync(post.id)
    toast.promise(promise, {
      loading: 'Checking owner access...',
      success: 'Post owner access verified.',
      error: getApiErrorMessage,
    })
    await promise
  }

  async function deletePost() {
    if (!pendingDelete) return

    const promise = deleteMutation.mutateAsync(pendingDelete.id)
    toast.promise(promise, {
      loading: 'Deleting post...',
      success: 'Post deleted.',
      error: getApiErrorMessage,
    })
    await promise
    setPendingDelete(null)
  }

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Posts</h2>
            <p className='text-muted-foreground'>
              Review paginated posts and create translated post content.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className='size-4' />
            New post
          </Button>
        </div>

        <div className='grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center'>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search loaded posts...'
          />
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='outline'
              disabled={!meta?.hasPreviousPage}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <span className='text-sm text-muted-foreground'>
              Page {meta?.page ?? page} of {meta?.pageCount ?? 1}
            </span>
            <Button
              type='button'
              variant='outline'
              disabled={!meta?.hasNextPage}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {postsQuery.isLoading && <ApiLoading label='Loading posts...' />}
        {postsQuery.isError && (
          <ApiError
            error={postsQuery.error}
            onRetry={() => void postsQuery.refetch()}
          />
        )}
        {!postsQuery.isLoading &&
          !postsQuery.isError &&
          filteredPosts.length === 0 && (
            <ApiEmpty
              title='No posts'
              description='Create a post or adjust the current search.'
            />
          )}
        {!postsQuery.isLoading &&
          !postsQuery.isError &&
          filteredPosts.length > 0 && (
            <PostsList
              posts={filteredPosts}
              onCheckAccess={checkAccess}
              onDelete={setPendingDelete}
              onOpenDetails={setDetailPost}
            />
          )}
      </Main>

      <CreatePostDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <PostDetailDialog
        post={detailPost}
        open={Boolean(detailPost)}
        onOpenChange={(open) => {
          if (!open) setDetailPost(null)
        }}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title='Delete post?'
        desc='The backend will delete this post if the current user owns it.'
        destructive
        isLoading={deleteMutation.isPending}
        handleConfirm={() => void deletePost()}
      />
    </>
  )
}

function PostsList({
  onCheckAccess,
  onDelete,
  onOpenDetails,
  posts,
}: {
  onCheckAccess: (post: Post) => Promise<void>
  onDelete: (post: Post) => void
  onOpenDetails: (post: Post) => void
  posts: Post[]
}) {
  return (
    <div className='grid gap-3'>
      {posts.map((post) => (
        <div key={post.id} className='rounded-md border p-4'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='min-w-0'>
              <div className='font-medium'>{getPostTitle(post)}</div>
              <div className='line-clamp-2 text-sm text-muted-foreground'>
                {getPostDescription(post)}
              </div>
              <div className='mt-1 text-xs text-muted-foreground'>
                Updated {formatPostDate(post.updatedAt)}
              </div>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={() => onOpenDetails(post)}
              >
                <Eye className='size-4' />
                Details
              </Button>
              <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={() => void onCheckAccess(post)}
              >
                <CheckCircle2 className='size-4' />
                Check access
              </Button>
              <Button
                type='button'
                size='icon'
                variant='ghost'
                onClick={() => onDelete(post)}
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CreatePostDialog({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const mutation = useCreatePost()
  const { form, handleApiSubmit } = useApiForm<z.input<typeof postSchema>>({
    defaultValues: {
      descriptionEn: '',
      descriptionRu: '',
      titleEn: '',
      titleRu: '',
    },
    resolver: zodResolver(postSchema),
  })
  const onSubmit = handleApiSubmit(async (values) => {
    const promise = mutation.mutateAsync(createPostBody(values))
    toast.promise(promise, {
      loading: 'Creating post...',
      success: 'Post created.',
      error: getApiErrorMessage,
    })
    await promise
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create post</DialogTitle>
          <DialogDescription>
            Create a post using backend translation arrays.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='create-post-form'
            onSubmit={onSubmit}
            className='grid gap-4'
          >
            <Tabs defaultValue='en'>
              <TabsList>
                <TabsTrigger value='en'>English</TabsTrigger>
                <TabsTrigger value='ru'>Russian</TabsTrigger>
              </TabsList>
              <TabsContent value='en' className='mt-4 grid gap-4'>
                <PostTranslationFields
                  descriptionName='descriptionEn'
                  form={form}
                  titleName='titleEn'
                />
              </TabsContent>
              <TabsContent value='ru' className='mt-4 grid gap-4'>
                <PostTranslationFields
                  descriptionName='descriptionRu'
                  form={form}
                  titleName='titleRu'
                />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
        <DialogFooter>
          <Button
            form='create-post-form'
            type='submit'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Plus className='size-4' />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PostTranslationFields({
  descriptionName,
  form,
  titleName,
}: {
  descriptionName: 'descriptionEn' | 'descriptionRu'
  form: ReturnType<typeof useApiForm<z.input<typeof postSchema>>>['form']
  titleName: 'titleEn' | 'titleRu'
}) {
  return (
    <>
      <FormField
        control={form.control}
        name={titleName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={descriptionName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea rows={5} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

function PostDetailDialog({
  onOpenChange,
  open,
  post,
}: {
  onOpenChange: (open: boolean) => void
  open: boolean
  post: Post | null
}) {
  const detailQuery = usePostDetail(open ? (post?.id ?? null) : null)
  const detail = detailQuery.data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post details</DialogTitle>
          <DialogDescription>
            Inspect the backend post and translation payload.
          </DialogDescription>
        </DialogHeader>
        {detailQuery.isLoading && <ApiLoading label='Loading post...' />}
        {detailQuery.isError && (
          <ApiError
            error={detailQuery.error}
            onRetry={() => void detailQuery.refetch()}
          />
        )}
        {!detailQuery.isLoading && !detailQuery.isError && !detail && (
          <ApiEmpty
            title='Post unavailable'
            description='The backend did not return this post.'
          />
        )}
        {detail && (
          <div className='grid gap-4'>
            <div>
              <div className='font-medium'>{getPostTitle(detail)}</div>
              <div className='text-sm text-muted-foreground'>
                {getPostDescription(detail)}
              </div>
            </div>
            <div className='grid gap-2'>
              {(detail.translations ?? []).map((translation) => (
                <div
                  key={`${translation.languageCode}-${translation.title}`}
                  className='rounded-md border p-3'
                >
                  <div className='flex items-center justify-between gap-2'>
                    <StatusPill tone='info'>
                      {translation.languageCode ?? 'UNKNOWN'}
                    </StatusPill>
                  </div>
                  <div className='mt-2 font-medium'>
                    {translation.title ?? 'Untitled'}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {translation.description ?? 'No description'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
