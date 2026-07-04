import type { PillTone } from '@/components/status-pill'
import type { MediaAsset, MediaStatusValue } from '../types'

export function getMediaStatusTone(status: MediaStatusValue): PillTone {
  switch (status) {
    case 'READY':
      return 'ok'
    case 'DELETED':
    default:
      return 'neutral'
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getRawMediaPath(asset: Pick<MediaAsset, 'url'>): string {
  return asset.url
}

export function isPreviewableImage(asset: Pick<MediaAsset, 'mimeType'>) {
  return asset.mimeType.startsWith('image/')
}
