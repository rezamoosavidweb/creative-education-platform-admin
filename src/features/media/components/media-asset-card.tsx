import { ExternalLink, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/status-pill'
import {
  formatBytes,
  getMediaStatusTone,
  getRawMediaPath,
  isPreviewableImage,
} from '../services/media-query'
import type { MediaAsset } from '../types'

type MediaAssetCardProps = {
  asset: MediaAsset
  onDelete: (asset: MediaAsset) => Promise<void>
}

export function MediaAssetCard({ asset, onDelete }: MediaAssetCardProps) {
  const rawPath = getRawMediaPath(asset)
  const remove = async () => {
    const promise = onDelete(asset)
    toast.promise(promise, {
      loading: 'Deleting media...',
      success: 'Media deleted.',
      error: getApiErrorMessage,
    })
    await promise
  }

  return (
    <div className='grid gap-4 rounded-md border border-[var(--bdr)] bg-[var(--sur)] p-4 lg:grid-cols-[240px_minmax(0,1fr)]'>
      <div className='flex aspect-video items-center justify-center overflow-hidden rounded-md border border-[var(--bdr)] bg-[var(--muted)] text-sm text-muted-foreground'>
        {isPreviewableImage(asset) ? (
          <img
            src={rawPath}
            alt=''
            className='h-full w-full object-cover'
            loading='lazy'
          />
        ) : (
          asset.kind
        )}
      </div>
      <div className='grid gap-3'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div>
            <div className='font-mono text-sm'>{asset.id}</div>
            <div className='text-sm text-muted-foreground'>
              {asset.mimeType} - {formatBytes(asset.sizeBytes)}
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <StatusPill tone={getMediaStatusTone(asset.status)}>
              {asset.status}
            </StatusPill>
            <StatusPill tone='neutral'>{asset.visibility}</StatusPill>
          </div>
        </div>
        <div className='grid gap-1 text-sm text-muted-foreground'>
          <span>Kind: {asset.kind}</span>
          <span>Created: {new Date(asset.createdAt).toLocaleString()}</span>
          <span>Updated: {new Date(asset.updatedAt).toLocaleString()}</span>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' asChild>
            <a href={rawPath} target='_blank' rel='noreferrer'>
              <ExternalLink className='size-4' />
              Raw
            </a>
          </Button>
          <Button variant='ghost' onClick={() => void remove()}>
            <Trash2 className='size-4' />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
