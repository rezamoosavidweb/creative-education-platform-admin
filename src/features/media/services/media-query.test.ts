import { describe, expect, it } from 'vitest'
import {
  formatBytes,
  getMediaStatusTone,
  getRawMediaPath,
  isPreviewableImage,
} from './media-query'

describe('media-query', () => {
  it('maps statuses and formats file sizes', () => {
    expect(getMediaStatusTone('READY')).toBe('ok')
    expect(getMediaStatusTone('DELETED')).toBe('neutral')
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(2048)).toBe('2.0 KB')
    expect(formatBytes(2 * 1024 * 1024)).toBe('2.0 MB')
  })

  it('derives raw paths and image previewability from backend DTOs', () => {
    expect(getRawMediaPath({ url: '/media/asset-1/raw' })).toBe(
      '/media/asset-1/raw'
    )
    expect(isPreviewableImage({ mimeType: 'image/png' })).toBe(true)
    expect(isPreviewableImage({ mimeType: 'audio/mpeg' })).toBe(false)
  })
})
