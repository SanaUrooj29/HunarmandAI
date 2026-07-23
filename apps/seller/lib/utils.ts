import clsx, { ClassValue } from 'clsx'

export { clsx }

/** Format PKR amount */
export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`
}

/** Format relative time */
export function relativeTime(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
}

/** Mask phone number */
export function maskPhone(phone: string): string {
  return phone.replace(/(\d{4})\d{4}(\d{2})/, '$1····$2')
}

/** Validate Pakistani mobile number */
export function isValidPKPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return /^(03\d{9}|3\d{9})$/.test(digits)
}

/** Generate storefront slug from name */
export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

/** Clamp a number between min and max */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}
