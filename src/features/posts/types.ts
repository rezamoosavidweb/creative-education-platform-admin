import type {
  CreatePostDto,
  PostControllerGetPosts200,
  PostControllerGetPostsParams,
  PostDto,
} from '@/lib/api/generated/model'

export type Post = PostDto
export type PostsPage = PostControllerGetPosts200
export type PostsParams = PostControllerGetPostsParams
export type CreatePostRequest = CreatePostDto
