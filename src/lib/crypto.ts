import crypto from 'crypto'

// 환경 변수 기반 키 설정 (32 bytes)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
  ? Buffer.from(process.env.ENCRYPTION_KEY, 'base64') 
  : crypto.randomBytes(32) // Fallback for types

const HMAC_KEY = process.env.HMAC_KEY 
  ? Buffer.from(process.env.HMAC_KEY, 'base64')
  : crypto.randomBytes(32)

const ALGORITHM = 'aes-256-gcm'

/**
 * 평문을 AES-256-GCM 알고리즘으로 암호화하여 반환
 * 포맷: iv:ciphertext:authtag (base64 인코딩)
 */
export function encryptField(text: string): string {
  if (!text) return ''
  
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  
  const authTag = cipher.getAuthTag().toString('base64')
  
  return `${iv.toString('base64')}:${encrypted}:${authTag}`
}

/**
 * 암호문을 복호화하여 평문 반환
 */
export function decryptField(encryptedData: string): string {
  if (!encryptedData) return ''
  
  try {
    const parts = encryptedData.split(':')
    if (parts.length !== 3) return encryptedData // 암호화 형식이 아니면 원본 반환
    
    const [ivStr, encryptedStr, authTagStr] = parts
    const iv = Buffer.from(ivStr, 'base64')
    const authTag = Buffer.from(authTagStr, 'base64')
    
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encryptedStr, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    console.error('Decryption failed:', error)
    return '***복호화 오류***'
  }
}

/**
 * 문자열을 블라인드 인덱스 조회를 위한 HMAC-SHA256 해시로 변환
 */
export function createBlindIndex(text: string): string {
  if (!text) return ''
  
  // 공백 제거 및 소문자화하여 검색 일치율 높임
  const normalizedText = text.replace(/\s+/g, '').toLowerCase()
  
  return crypto
    .createHmac('sha256', HMAC_KEY)
    .update(normalizedText)
    .digest('base64')
}
