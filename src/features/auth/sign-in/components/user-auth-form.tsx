import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { getApiErrorMessage } from '@/lib/api'
import { getSafeAuthRedirect, useLogin, type LoginRequest } from '@/lib/auth'
import { useApiForm } from '@/lib/forms'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .min(7, 'Password must be at least 7 characters long.'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const { form, handleApiSubmit } = useApiForm<LoginRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = handleApiSubmit((data) => {
    const loginPromise = loginMutation.mutateAsync(data)

    toast.promise(loginPromise, {
      loading: 'Signing in...',
      success: () => {
        const targetPath = getSafeAuthRedirect(redirectTo)
        navigate({ to: targetPath, replace: true })

        return `Welcome back, ${data.email}!`
      },
      error: getApiErrorMessage,
    })

    return loginPromise
  })

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={loginMutation.isPending}>
          {loginMutation.isPending ? (
            <Loader2 className='animate-spin' />
          ) : (
            <LogIn />
          )}
          Sign in
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='outline'
            type='button'
            disabled={loginMutation.isPending}
          >
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button
            variant='outline'
            type='button'
            disabled={loginMutation.isPending}
          >
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
