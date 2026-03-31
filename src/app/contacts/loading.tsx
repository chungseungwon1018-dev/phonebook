export default function ContactsLoading() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center py-4">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
          <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
        </div>
        <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
      </div>
      
      <div className="flex gap-4 items-center justify-between sticky top-4 p-2 -mx-2 bg-zinc-50/80 dark:bg-black/80">
        <div className="h-10 flex-1 max-w-md bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
          <div className="h-10 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
        </div>
      </div>

      <div className="flex gap-2 pb-2">
        <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
        <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
        <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col p-5 bg-white/70 dark:bg-zinc-900/70 border border-black/5 dark:border-white/10 rounded-2xl gap-3">
            <div className="flex flex-col gap-2">
              <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
