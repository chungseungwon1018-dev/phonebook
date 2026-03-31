'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CategorySchema } from '@/lib/validators'

export async function getCategories() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const color = formData.get('color') as string || null

  const parsed = CategorySchema.safeParse({ name, color })
  if (!parsed.success) throw new Error(parsed.error.errors[0].message)
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('categories').insert({
    user_id: user.id,
    name: parsed.data.name,
    color: parsed.data.color
  })

  if (error) throw new Error('분류 추가 실패')
  revalidatePath('/categories')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error('분류 삭제 실패')
  revalidatePath('/categories')
  revalidatePath('/contacts')
}
