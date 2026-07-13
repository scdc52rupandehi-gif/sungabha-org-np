export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative flex justify-center items-center">
        <div className="absolute animate-ping inline-flex h-12 w-12 rounded-full bg-emerald-400 opacity-20"></div>
        <div className="relative inline-flex rounded-full h-12 w-12 bg-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          S
        </div>
      </div>
      <p className="mt-6 text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">Loading SCDC...</p>
    </div>
  )
}
