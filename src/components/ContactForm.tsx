'use client'

import { useTransition } from 'react'

export function ContactForm({
  action,
  initialData,
  categories,
  onCancel
}: {
  action: (formData: FormData) => Promise<void>
  initialData?: { id?: string, name: string, phone: string, categoryId?: string, memo?: string } | null
  categories: { id: string, name: string }[]
  onCancel?: () => void
}) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await action(formData)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
        <input 
          name="name"
          defaultValue={initialData?.name || ''}
          placeholder="Apple Seed"
          required
          className="px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone</label>
        <input 
          name="phone"
          defaultValue={initialData?.phone || ''}
          placeholder="010-0000-0000"
          pattern="^[0-9\-\s]+$"
          required
          className="px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category</label>
        <select 
          name="categoryId"
          defaultValue={initialData?.categoryId || ''}
          className="px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="">No Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Memo (Optional)</label>
        <textarea 
          name="memo"
          defaultValue={initialData?.memo || ''}
          placeholder="Notes..."
          rows={3}
          className="px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400 resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-full font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:active:scale-100"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
