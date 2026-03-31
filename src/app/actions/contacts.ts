'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { encryptField, decryptField, createBlindIndex } from '@/lib/crypto'
import { ContactSchema } from '@/lib/validators'

export async function getContacts({ 
  categoryId, 
  searchQuery, 
  page = 1, 
  limit = 20 
}: { 
  categoryId?: string | null, 
  searchQuery?: string,
  page?: number,
  limit?: number 
} = {}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], total: 0 }

  let query = supabase
    .from('contacts')
    .select('id, category_id, name_encrypted, phone_encrypted, memo, created_at', { count: 'exact' })
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  // 정확 일치 검색은 DB 레벨에서 필터링 가능
  if (searchQuery) {
    const blindIndex = createBlindIndex(searchQuery)
    // 부분 일치는 아래 메모리 필터링으로 처리하되, 우선 가져올 데이터를 줄이기 위한 최적화가 필요할 수 있음
    // 여기서는 단순성을 위해 검색어가 있으면 전체를 가져와 메모리에서 필터링합니다 (대규모 데이터에는 부적합하지만 소규모 연락처용)
    // 정확 일치라면 .or(`name_index.eq.${blindIndex},phone_index.eq.${blindIndex}`) 가능
  }

  // 검색어가 없을 때만 DB 페이징 수행
  if (!searchQuery) {
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
  }

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching contacts:', error)
    return { data: [], total: 0 }
  }

  // 복호화 수행
  let decryptedData = data.map(contact => ({
    id: contact.id,
    categoryId: contact.category_id,
    name: decryptField(contact.name_encrypted),
    phone: decryptField(contact.phone_encrypted),
    memo: contact.memo,
    createdAt: contact.created_at,
  }))

  // 부분 일치 검색 필터링 (메모리)
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase()
    decryptedData = decryptedData.filter(
      c => c.name.toLowerCase().includes(lowerQuery) || c.phone.replace(/-/g, '').includes(lowerQuery.replace(/-/g, ''))
    )
    
    // 검색 시 메모리에서 페이징
    const from = (page - 1) * limit
    const to = from + limit
    const paginatedData = decryptedData.slice(from, to)
    
    return { data: paginatedData, total: decryptedData.length }
  }

  return { data: decryptedData, total: count || 0 }
}

export async function createContact(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const categoryId = formData.get('categoryId') as string || null
  const memo = formData.get('memo') as string || null

  const parsed = ContactSchema.safeParse({ name, phone, categoryId, memo })
  if (!parsed.success) throw new Error(parsed.error.errors[0].message)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('contacts').insert({
    user_id: user.id,
    name_encrypted: encryptField(parsed.data.name),
    phone_encrypted: encryptField(parsed.data.phone),
    name_index: createBlindIndex(parsed.data.name),
    phone_index: createBlindIndex(parsed.data.phone),
    category_id: parsed.data.categoryId || null,
    memo: parsed.data.memo,
  })

  if (error) throw new Error('연락처 추가 실패')
  revalidatePath('/contacts')
}

export async function updateContact(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const categoryId = formData.get('categoryId') as string || null
  const memo = formData.get('memo') as string || null

  const parsed = ContactSchema.safeParse({ id, name, phone, categoryId, memo })
  if (!parsed.success) throw new Error(parsed.error.errors[0].message)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('contacts')
    .update({
      name_encrypted: encryptField(parsed.data.name),
      phone_encrypted: encryptField(parsed.data.phone),
      name_index: createBlindIndex(parsed.data.name),
      phone_index: createBlindIndex(parsed.data.phone),
      category_id: parsed.data.categoryId || null,
      memo: parsed.data.memo,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error('연락처 수정 실패')
  revalidatePath('/contacts')
}

export async function deleteContact(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Soft delete
  const { error } = await supabase
    .from('contacts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error('연락처 삭제 실패')
  revalidatePath('/contacts')
}
