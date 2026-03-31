'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in zoom-in-95 duration-300">
      <div className="bg-white dark:bg-zinc-900 border border-red-100 dark:border-red-900/30 shadow-xl shadow-red-500/5 rounded-3xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">문제가 발생했습니다.</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 break-keep">
          {error.message || '요청을 처리하는 중에 예상치 못한 오류가 발생했습니다.'}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black font-medium text-sm rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
