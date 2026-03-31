import { getCategories, createCategory, deleteCategory } from '@/app/actions/categories'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function CategoriesPage() {
  const categories = await getCategories()

  const handleCreate = async (formData: FormData) => {
    'use server'
    await createCategory(formData)
    revalidatePath('/categories')
  }

  const handleDelete = async (formData: FormData) => {
    'use server'
    const id = formData.get('id') as string
    if (id) {
      await deleteCategory(id)
      revalidatePath('/categories')
    }
  }

  return (
    <div className="flex flex-col max-w-2xl mx-auto w-full pt-8 pb-16 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/contacts"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">분류(그룹) 관리</h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-white/5 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-10">
        
        {/* 새 분류 추가 폼 */}
        <form action={handleCreate} className="flex flex-col sm:flex-row gap-4 mb-10 items-end">
          <div className="flex flex-col gap-2 flex-1 w-full">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">새 분류명</label>
            <input 
              name="name"
              placeholder="친구, 가족 등"
              required
              className="px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-400 w-full"
            />
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">색상 (선택)</label>
            <input 
              name="color"
              type="color"
              defaultValue="#000000"
              className="h-[48px] w-16 p-1 rounded-xl cursor-pointer bg-zinc-100 dark:bg-zinc-800/50 border-none"
            />
          </div>
          <button 
            type="submit"
            className="h-[48px] px-6 rounded-xl font-medium text-white bg-black dark:bg-white dark:text-black hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
          >
            추가
          </button>
        </form>

        {/* 기존 분류 목록 */}
        <h3 className="text-lg font-semibold tracking-tight border-b dark:border-zinc-800 pb-3 mb-4">현재 분류 목록</h3>
        {categories.length === 0 ? (
          <p className="text-zinc-500 text-sm py-4">등록된 그룹이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {categories.map(c => (
              <li key={c.id} className="flex justify-between items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm border border-black/10" 
                    style={{ backgroundColor: c.color || '#ccc' }}
                  />
                  <span className="font-medium">{c.name}</span>
                </div>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={c.id} />
                  <button 
                    type="submit"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  >
                    삭제
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  )
}
