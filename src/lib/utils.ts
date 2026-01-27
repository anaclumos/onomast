import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Matches Basic Latin + Latin Extended-A/B + Latin Extended Additional + diacritics
const LATIN_PATTERN =
  /^[\u0041-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF]+$/

// Strips digits, whitespace, and common punctuation/symbols
const NON_LETTER_PATTERN = /[\d\s\-_.!@#$%^&*()+=[\]{};:'",.<>?/\\|`~]/g

/**
 * Returns true if the string contains non-Latin characters
 * (CJK, Cyrillic, Arabic, Devanagari, Thai, etc.)
 */
export function hasNonLatinCharacters(text: string): boolean {
  const letters = text.replace(NON_LETTER_PATTERN, '')
  if (letters.length === 0) {
    return false
  }
  return !LATIN_PATTERN.test(letters)
}
