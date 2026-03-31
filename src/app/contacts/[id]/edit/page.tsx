import { getCategories } from '@/app/actions/categories'
import { updateContact } from '@/app/actions/contacts'
import { ContactForm } from '@/components/ContactForm'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { decryptField } from '@/lib/crypto'

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const { id } = params
  
  const [categories, supabase] = await Promise.all([
    getCategories(),
    createClient()
  ])

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: contact } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single()

  if (!contact) redirect('/contacts')

  const initialData = {
    id: contact.id,
    name: decryptField(contact.name_encrypted),
    phone: decryptField(contact.phone_encrypted),
    categoryId: contact.category_id,
    memo: contact.memo
  }

  const handleUpdate = async (formData: FormData) => {
    'use server'
    await updateContact(id, formData)
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
        <h1 className="text-2xl font-bold tracking-tight">연락처 수정</h1>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-white/5 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-10">
        <ContactForm 
          action={handleUpdate} 
          categories={categories}
          initialData={initialData}
        />
      </div>
    </div>
  )
}
