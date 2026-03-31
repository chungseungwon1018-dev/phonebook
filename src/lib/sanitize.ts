import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window
const purify = DOMPurify(window)

/**
 * XSS 방어를 위해 문자열 내 악성 태그 삭제
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty) return ''
  return purify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) // 태그 일체 허용 안 함 (순수 텍스트화)
}
