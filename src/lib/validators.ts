import { z } from 'zod'

export const ContactSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, '이름을 입력해주세요.').max(50),
  phone: z.string().regex(/^[0-9\-\s]+$/, '올바른 전화번호 형식이 아닙니다.').max(20),
  categoryId: z.string().uuid().optional().nullable(),
  memo: z.string().max(200).optional().nullable(),
})

export const CategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, '분류명을 입력해주세요.').max(50),
  color: z.string().max(10).optional().nullable(),
})
