import { getCategories } from '@/app/actions/categories'
import { createContact } from '@/app/actions/contacts'
import { ContactForm } from '@/components/ContactForm'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewContactPage() {
  const categories = await getCategories()

  const handleCreate = async (formData: FormData) => {
    'use server'
    await createContact(formData)
    redirect('/contacts')
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
        <h1 className="text-2xl font-bold tracking-tight">새 연락처 추가</h1>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-white/5 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-10">
        <ContactForm 
          action={handleCreate} 
          categories={categories}
        />
      </div>
    </div>
  )
}
