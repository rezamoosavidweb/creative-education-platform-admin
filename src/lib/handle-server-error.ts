import { toast } from 'sonner'
import { getApiErrorMessage } from './api'

export function handleServerError(error: unknown) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(error)
  }

  toast.error(getApiErrorMessage(error))
}
