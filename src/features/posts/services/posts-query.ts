import type { CreatePostRequest, Post, PostsPage } from '../types'

type TranslationInput = CreatePostRequest['title'][number]

export function getPosts(page: PostsPage | undefined): Post[] {
  return page?.data ?? []
}

export function getPostTitle(post: Post): string {
  return post.title ?? post.translations?.[0]?.title ?? 'Untitled post'
}

export function getPostDescription(post: Post): string {
  return (
    post.description ?? post.translations?.[0]?.description ?? 'No description'
  )
}

export function formatPostDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function filterPosts(posts: Post[], query: string): Post[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return posts

  return posts.filter((post) =>
    [
      post.id,
      post.title,
      post.description,
      post.info,
      ...(post.translations ?? []).flatMap((translation) => [
        translation.title,
        translation.description,
        translation.languageCode,
      ]),
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalized))
  )
}

export function createPostBody(values: {
  descriptionEn: string
  descriptionRu?: string
  titleEn: string
  titleRu?: string
}): CreatePostRequest {
  const title: TranslationInput[] = [
    { languageCode: 'en_US', text: values.titleEn.trim() },
  ]
  const description: TranslationInput[] = [
    { languageCode: 'en_US', text: values.descriptionEn.trim() },
  ]

  if (values.titleRu?.trim()) {
    title.push({ languageCode: 'ru_RU', text: values.titleRu.trim() })
  }

  if (values.descriptionRu?.trim()) {
    description.push({
      languageCode: 'ru_RU',
      text: values.descriptionRu.trim(),
    })
  }

  return { description, title }
}
