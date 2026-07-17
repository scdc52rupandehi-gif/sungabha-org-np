"use client"
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Something went wrong!</h2>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
        We apologize for the inconvenience. Our team has been notified of the issue.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Try again
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
        >
          Go to Homepage
        </Button>
      </div>
    </div>
  )
}
