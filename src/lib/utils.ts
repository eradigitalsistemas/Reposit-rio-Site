import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPhone = (val: string) => {
  const v = val.replace(/\D/g, '').slice(0, 11)
  if (v.length === 11) return `(${v.slice(0, 2)}) ${v.slice(2, 3)} ${v.slice(3, 7)}-${v.slice(7)}`
  if (v.length >= 7) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`
  if (v.length >= 3) return `(${v.slice(0, 2)}) ${v.slice(2)}`
  return v
}

export const formatCNPJ = (val: string) => {
  const v = val.replace(/\D/g, '').slice(0, 14)
  if (v.length >= 13)
    return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-${v.slice(12)}`
  if (v.length >= 9) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8)}`
  if (v.length >= 6) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5)}`
  if (v.length >= 3) return `${v.slice(0, 2)}.${v.slice(2)}`
  return v
}
