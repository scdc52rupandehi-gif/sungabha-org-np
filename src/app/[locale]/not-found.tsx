import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-6xl font-bold text-emerald-600 mb-4">404</h2>
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Page Not Found</h3>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 rounded-full font-semibold transition-all">
          Return to Homepage
        </Button>
      </Link>
    </div>
  )
}
