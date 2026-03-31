import { getContacts } from '@/app/actions/contacts'
import { getCategories } from '@/app/actions/categories'
import { ContactCard } from '@/components/ContactCard'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import { Pagination } from '@/components/Pagination'
import { DeleteDialog } from '@/components/DeleteDialog'
import Link from 'next/link'
import { logout } from '@/app/actions'

export const dynamic = 'force-dynamic'

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; page?: string }
}) {
  const query = searchParams.q || ''
  const categoryId = searchParams.category || null
  const page = Number(searchParams.page) || 1
  const limit = 12

  // 데이터 동시 패치 (부분일치 검색 성능 고려)
  const [categories, { data: contacts, total }] = await Promise.all([
    getCategories(),
    getContacts({ categoryId, searchQuery: query, page, limit })
  ])

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 slide-in-from-bottom-4">
      {/* Header */}
      <header className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center py-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">연락처</h1>
          <p className="text-zinc-500 text-sm mt-1">총 {total}명의 연락처가 암호화되어 관리되고 있습니다.</p>
        </div>
        
        <form action={logout}>
          <button className="text-sm font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
            로그아웃
          </button>
        </form>
      </header>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-4 z-10 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-md p-2 -mx-2 rounded-2xl">
        <div className="flex gap-4 items-center w-full sm:w-auto flex-1">
          <SearchBar initialQuery={query} />
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <Link 
            href="/categories"
            className="flex-shrink-0 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-sm font-medium rounded-full transition-colors whitespace-nowrap"
          >
            분류 관리
          </Link>
          <Link 
            href="/contacts/new"
            className="flex-shrink-0 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-md hover:shadow-lg rounded-full transition-all active:scale-95 whitespace-nowrap"
          >
            새 연락처 추가
          </Link>
        </div>
      </div>

      <CategoryFilter categories={categories} selectedId={categoryId} />

      {/* Contact Grid */}
      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-3xl">
            📇
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">연락처가 없습니다</h3>
          <p className="text-zinc-500 mt-2 text-sm max-w-sm">
            {query || categoryId 
              ? '조건에 맞는 연락처를 찾을 수 없습니다.' 
              : '새 연락처를 추가하여 안전하게 관리해 보세요.'}
          </p>
          {!(query || categoryId) && (
            <Link 
              href="/contacts/new"
              className="mt-6 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              추가하기
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-4">
          {contacts.map((contact) => {
            const cat = categories.find(c => c.id === contact.categoryId)
            return (
              <ContactCard
                key={contact.id}
                name={contact.name}
                phone={contact.phone}
                memo={contact.memo}
                categoryName={cat?.name}
                categoryColor={cat?.color}
                actions={
                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/contacts/${contact.id}/edit`}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteDialog contactId={contact.id} contactName={contact.name} />
                  </div>
                }
              />
            )
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination total={total} limit={limit} />

    </div>
  )
}
