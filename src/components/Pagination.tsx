'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function Pagination({ total, limit }: { total: number; limit: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get('page')) || 1
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  const handlePage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8 py-4">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePage(currentPage - 1)}
        className="px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        이전
      </button>
      
      <span className="text-sm font-medium text-zinc-500 px-4">
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePage(currentPage + 1)}
        className="px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        다음
      </button>
    </div>
  )
}
