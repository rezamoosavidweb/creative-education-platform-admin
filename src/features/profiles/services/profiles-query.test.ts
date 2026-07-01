import { describe, expect, it } from 'vitest'
import type { DirectoryEntry, Profile } from '../types'
import {
  getDirectoryEntries,
  getDirectoryTableMeta,
  getProfileStats,
  getVerificationStatusTone,
  normalizeDirectoryQuery,
} from './profiles-query'

describe('profiles-query', () => {
  it('normalizes directory filters to backend query values', () => {
    expect(
      normalizeDirectoryQuery({
        availableForHire: 'true',
        country: 'US',
        verified: 'false',
      })
    ).toEqual({
      availableForHire: 'true',
      country: 'US',
      verified: 'false',
    })
  })

  it('removes unsupported empty directory filters', () => {
    expect(
      normalizeDirectoryQuery({
        availableForHire: 'all',
        country: '',
        verified: undefined,
      })
    ).toEqual({})
  })

  it('maps directory arrays and table metadata', () => {
    const entries = [
      {
        handle: 'artist',
      } as DirectoryEntry,
    ]

    expect(getDirectoryEntries(entries)).toEqual(entries)
    expect(getDirectoryEntries(undefined)).toEqual([])
    expect(getDirectoryTableMeta(entries)).toMatchObject({
      pageCount: 1,
      rowCount: 1,
    })
    expect(getDirectoryTableMeta([])).toMatchObject({
      pageCount: 0,
      rowCount: 0,
    })
  })

  it('derives profile stats from backend records', () => {
    const profile = {
      handle: 'artist',
      published: true,
    } as Profile
    const entries = [{ handle: 'artist' }] as DirectoryEntry[]

    expect(
      getProfileStats({
        directoryEntries: entries,
        instructorProfile: undefined,
        practitionerProfile: {},
        profile,
        studioProfile: {},
      })
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'published', value: 'Published' }),
        expect.objectContaining({ id: 'public', value: '1' }),
        expect.objectContaining({ id: 'personas', value: '2' }),
      ])
    )
  })

  it('maps verification status tones', () => {
    expect(getVerificationStatusTone('VERIFIED')).toBe('ok')
    expect(getVerificationStatusTone('PENDING')).toBe('warn')
    expect(getVerificationStatusTone('REJECTED')).toBe('err')
    expect(getVerificationStatusTone('UNVERIFIED')).toBe('neutral')
  })
})
