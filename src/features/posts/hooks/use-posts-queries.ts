import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  postControllerCreatePost,
  postControllerDeletePost,
  postControllerGetPosts,
  postControllerGetSinglePost,
  postControllerUpdatePost,
} from '@/lib/api/generated/endpoints/posts/posts'
import type { CreatePostRequest, PostsParams } from '../types'

export const postsQueryKeys = {
  all: ['posts'] as const,
  detail: (id: string | null) => [...postsQueryKeys.all, 'detail', id] as const,
  list: (params: PostsParams) =>
    [...postsQueryKeys.all, 'list', params] as const,
}

export function usePosts(params: PostsParams) {
  return useQuery({
    queryFn: ({ signal }) => postControllerGetPosts(params, undefined, signal),
    queryKey: postsQueryKeys.list(params),
  })
}

export function usePostDetail(id: string | null) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: ({ signal }) =>
      postControllerGetSinglePost(id ?? '', undefined, signal),
    queryKey: postsQueryKeys.detail(id),
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: CreatePostRequest) =>
      postControllerCreatePost(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsQueryKeys.all })
    },
  })
}

export function useCheckPostAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => postControllerUpdatePost(id, {}),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({
        queryKey: postsQueryKeys.detail(id),
      })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => postControllerDeletePost(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsQueryKeys.all })
    },
  })
}
