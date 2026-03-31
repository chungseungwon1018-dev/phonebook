import { type ReactNode } from 'react'

export function ContactCard({
  name,
  phone,
  memo,
  categoryName,
  categoryColor,
  actions
}: {
  name: string
  phone: string
  memo?: string | null
  categoryName?: string
  categoryColor?: string | null
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col p-5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 gap-3 group">
      
      {/* Header section with name and category */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {name}
            </h3>
            {categoryName && (
              <span 
                className="px-2 py-0.5 text-xs font-medium rounded-full"
                style={{ 
                  backgroundColor: categoryColor ? `${categoryColor}20` : '#e4e4e7',
                  color: categoryColor || '#52525b'
                }}>
                {categoryName}
              </span>
            )}
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-mono text-sm tracking-wide">
            {phone}
          </p>
        </div>
        
        {/* Actions (visible on hover or always on mobile) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {actions}
        </div>
      </div>
      
      {/* Memo (if any) */}
      {memo && (
        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/5">
          {memo}
        </div>
      )}
    </div>
  )
}
