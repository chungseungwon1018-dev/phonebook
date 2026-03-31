'use client'

import { useTransition, useState } from 'react'
import { deleteContact } from '@/app/actions/contacts'

export function DeleteDialog({ 
  contactId, 
  contactName,
  onClose,
  trigger
}: { 
  contactId: string; 
  contactName: string;
  onClose?: () => void;
  trigger?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteContact(contactId)
      setIsOpen(false)
      if (onClose) onClose()
    })
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <button className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
            Delete
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
              연락처 삭제
            </h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              정말로 <strong className="text-zinc-700 dark:text-zinc-300">"{contactName}"</strong> 연락처를 삭제하시겠습니까?<br/>이 작업은 되돌릴 수 없습니다.
            </p>
            
            <div className="flex gap-3 justify-end mt-6">
              <button 
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                취소
              </button>
              <button 
                disabled={isPending}
                onClick={handleDelete}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 active:scale-95 rounded-full transition-all shadow-sm disabled:opacity-50 disabled:active:scale-100"
              >
                {isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
