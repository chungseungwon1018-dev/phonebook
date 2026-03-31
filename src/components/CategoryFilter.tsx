'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function CategoryFilter({
  categories,
  selectedId
}: {
  categories: { id: string, name: string, color?: string | null }[]
  selectedId?: string | null
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSelect = (id: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (id) {
      params.set('category', id)
      params.set('page', '1')
    } else {
      params.delete('category')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-1">
      <button
        onClick={() => handleSelect(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
          !selectedId
            ? 'bg-zinc-800 text-white dark:bg-white dark:text-black shadow-md scale-105'
            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        }`}
      >
        전체
      </button>
      
      {categories.map((c) => {
        const isSelected = selectedId === c.id
        return (
          <button
            key={c.id}
            onClick={() => handleSelect(c.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              isSelected
                ? 'bg-zinc-800 text-white dark:bg-white dark:text-black shadow-md scale-105 border-transparent'
                : 'bg-transparent text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            {c.name}
          </button>
        )
      })}
    </div>
  )
}
