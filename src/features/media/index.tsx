import { useState, type ChangeEvent } from 'react'
import { FileUp, Search } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { MediaAssetCard } from './components/media-asset-card'
import {
  useDeleteMediaAsset,
  useMediaAsset,
  useUploadMedia,
} from './hooks/use-media-queries'
import type { MediaAsset, MediaVisibilityValue } from './types'

export function Media() {
  const [lookupId, setLookupId] = useState('')
  const [assetId, setAssetId] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [visibility, setVisibility] = useState<MediaVisibilityValue>('PRIVATE')

  const assetQuery = useMediaAsset(assetId)
  const uploadMutation = useUploadMedia()
  const deleteMutation = useDeleteMediaAsset()

  const upload = async () => {
    if (!file) return

    const promise = uploadMutation.mutateAsync({
      body: { file },
      params: { visibility: visibility.toLowerCase() },
    })

    toast.promise(promise, {
      loading: 'Uploading media...',
      success: 'Media uploaded.',
      error: getApiErrorMessage,
    })

    const uploaded = await promise
    setAssetId(uploaded.id)
    setLookupId(uploaded.id)
    setFile(null)
  }

  const loadAsset = () => {
    const trimmed = lookupId.trim()
    if (trimmed) setAssetId(trimmed)
  }

  const deleteAsset = async (asset: MediaAsset) => {
    await deleteMutation.mutateAsync(asset.id)
    await assetQuery.refetch()
  }

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null)
  }

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Media</h2>
          <p className='text-muted-foreground'>
            Upload media and inspect public assets by backend UUID.
          </p>
        </div>

        <div className='grid gap-3 rounded-md border border-[var(--bdr)] bg-[var(--sur)] p-4 lg:grid-cols-[minmax(0,1fr)_160px_auto] lg:items-end'>
          <div className='grid gap-2'>
            <span className='text-sm font-medium'>File</span>
            <Input type='file' onChange={onFileChange} />
          </div>
          <div className='grid gap-2'>
            <span className='text-sm font-medium'>Visibility</span>
            <Select
              value={visibility}
              onValueChange={(value) =>
                setVisibility(value as MediaVisibilityValue)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='PRIVATE'>PRIVATE</SelectItem>
                <SelectItem value='PUBLIC'>PUBLIC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button disabled={!file || uploadMutation.isPending} onClick={upload}>
            <FileUp className='size-4' />
            Upload
          </Button>
        </div>

        <div className='grid gap-3 rounded-md border border-[var(--bdr)] bg-[var(--sur)] p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end'>
          <div className='grid gap-2'>
            <span className='text-sm font-medium'>Asset ID</span>
            <Input
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
              placeholder='Backend media UUID'
            />
          </div>
          <Button variant='outline' onClick={loadAsset}>
            <Search className='size-4' />
            Load asset
          </Button>
        </div>

        {!assetId && (
          <ApiEmpty
            title='No asset selected'
            description='Upload a file or enter a public media UUID to inspect an asset.'
          />
        )}
        {assetId && assetQuery.isLoading && (
          <ApiLoading label='Loading media asset...' />
        )}
        {assetId && assetQuery.isError && (
          <ApiError
            error={assetQuery.error}
            onRetry={() => void assetQuery.refetch()}
          />
        )}
        {assetId && assetQuery.data && (
          <MediaAssetCard asset={assetQuery.data} onDelete={deleteAsset} />
        )}
      </Main>
    </>
  )
}
