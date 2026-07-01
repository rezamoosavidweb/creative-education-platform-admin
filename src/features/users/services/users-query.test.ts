import { describe, expect, it } from 'vitest'
import type { UsersListResponse } from '../types'
import {
  getUsersListItems,
  getUsersListMeta,
  normalizeUsersOrder,
  toUsersListQuery,
} from './users-query'

describe('users query helpers', () => {
  it('builds a generated /users query from server table state', () => {
    expect(
      toUsersListQuery({
        order: 'ASC',
        page: 2,
        q: '  jordan  ',
        sortBy: 'createdAt',
        take: 20,
      })
    ).toEqual({
      order: 'ASC',
      page: 2,
      q: 'jordan',
      take: 20,
    })
  })

  it('drops unsupported or empty values instead of sending fake filters', () => {
    expect(
      toUsersListQuery({
        order: 'newest',
        page: 0,
        q: '   ',
        role: ['ADMIN'],
        status: ['active'],
        take: -1,
      })
    ).toEqual({})
  })

  it('normalizes generated PageDto data and metadata', () => {
    const response: UsersListResponse = {
      data: [],
      meta: {
        hasNextPage: false,
        hasPreviousPage: false,
        itemCount: 0,
        page: 1,
        pageCount: 1,
        take: 10,
      },
    }

    expect(getUsersListItems(response)).toEqual([])
    expect(getUsersListMeta(response)).toEqual(response.meta)
  })

  it('accepts only generated Order enum values', () => {
    expect(normalizeUsersOrder('DESC')).toBe('DESC')
    expect(normalizeUsersOrder('ASC')).toBe('ASC')
    expect(normalizeUsersOrder('desc')).toBeUndefined()
  })
})
