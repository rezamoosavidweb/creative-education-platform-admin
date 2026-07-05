import { describe, expect, it } from 'vitest'
import type { Post, PostsPage } from '../types'
import {
  createPostBody,
  filterPosts,
  formatPostDate,
  getPostDescription,
  getPosts,
  getPostTitle,
} from './posts-query'

const post = {
  createdAt: '2026-01-01T00:00:00.000Z',
  description: undefined,
  id: 'post-1',
  info: 'keywords.admin',
  title: undefined,
  translations: [
    {
      createdAt: '2026-01-01T00:00:00.000Z',
      description: 'Description',
      id: 'translation-1',
      languageCode: 'en_US',
      title: 'Title',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  updatedAt: '2026-01-02T00:00:00.000Z',
} satisfies Post

describe('posts-query', () => {
  it('normalizes paginated post responses', () => {
    const page = {
      data: [post],
      meta: {
        hasNextPage: false,
        hasPreviousPage: false,
        itemCount: 1,
        page: 1,
        pageCount: 1,
        take: 10,
      },
    } satisfies PostsPage

    expect(getPosts(undefined)).toEqual([])
    expect(getPosts(page)).toEqual([post])
  })

  it('falls back to translations for display text', () => {
    expect(getPostTitle(post)).toBe('Title')
    expect(getPostDescription(post)).toBe('Description')
    expect(formatPostDate(post.updatedAt)).toContain('2026')
  })

  it('filters loaded posts and creates translation request bodies', () => {
    expect(filterPosts([post], 'title')).toEqual([post])
    expect(filterPosts([post], 'missing')).toEqual([])
    expect(
      createPostBody({
        descriptionEn: 'English description',
        descriptionRu: 'Russian description',
        titleEn: 'English title',
        titleRu: 'Russian title',
      })
    ).toEqual({
      description: [
        { languageCode: 'en_US', text: 'English description' },
        { languageCode: 'ru_RU', text: 'Russian description' },
      ],
      title: [
        { languageCode: 'en_US', text: 'English title' },
        { languageCode: 'ru_RU', text: 'Russian title' },
      ],
    })
  })
})
