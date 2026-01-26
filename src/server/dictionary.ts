import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { DictionaryResult, UrbanDictionaryResult } from '@/lib/types'

interface DictionaryApiPhonetic {
  text?: string
  audio?: string
}

interface DictionaryApiDefinition {
  definition: string
  example?: string
  synonyms?: string[]
  antonyms?: string[]
}

interface DictionaryApiMeaning {
  partOfSpeech: string
  definitions?: DictionaryApiDefinition[]
  synonyms?: string[]
  antonyms?: string[]
}

interface DictionaryApiEntry {
  word: string
  phonetics?: DictionaryApiPhonetic[]
  meanings?: DictionaryApiMeaning[]
  sourceUrls?: string[]
}

interface UrbanDictionaryApiItem {
  word: string
  definition: string
  example?: string
  thumbs_up?: number
  thumbs_down?: number
  author: string
  permalink: string
}

interface UrbanDictionaryApiResponse {
  list?: UrbanDictionaryApiItem[]
}

const wordInput = z.object({ word: z.string().min(1).max(100) })

export const checkDictionary = createServerFn({ method: 'GET' })
  .inputValidator(wordInput)
  .handler(async ({ data }): Promise<DictionaryResult> => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(data.word)}`,
        { signal: AbortSignal.timeout(10_000) }
      )
      if (!res.ok) {
        return { found: false, word: data.word, phonetics: [], meanings: [] }
      }

      const json: DictionaryApiEntry[] = await res.json()
      const entry = json[0]
      return {
        found: true,
        word: entry.word,

        phonetic: entry.phonetics?.find((p) => p.text)?.text,

        phonetics: (entry.phonetics || []).map((p) => ({
          text: p.text,
          audio: p.audio,
        })),

        meanings: (entry.meanings || []).map((m) => ({
          partOfSpeech: m.partOfSpeech,
          definitions: (m.definitions || []).slice(0, 3).map((d) => ({
            definition: d.definition,
            example: d.example,
            synonyms: d.synonyms || [],
            antonyms: d.antonyms || [],
          })),
          synonyms: m.synonyms || [],
          antonyms: m.antonyms || [],
        })),
        sourceUrl: entry.sourceUrls?.[0],
      }
    } catch {
      return { found: false, word: data.word, phonetics: [], meanings: [] }
    }
  })

export const checkUrbanDictionary = createServerFn({ method: 'GET' })
  .inputValidator(wordInput)
  .handler(async ({ data }): Promise<UrbanDictionaryResult> => {
    try {
      const res = await fetch(
        `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(data.word)}`,
        { signal: AbortSignal.timeout(10_000) }
      )
      if (!res.ok) {
        return { found: false, entries: [] }
      }
      const json: UrbanDictionaryApiResponse = await res.json()

      const list = json.list || []
      return {
        found: list.length > 0,

        entries: list.slice(0, 3).map((item) => ({
          word: item.word,
          definition: item.definition.replace(/\[|\]/g, ''),
          example: (item.example || '').replace(/\[|\]/g, ''),
          thumbs_up: item.thumbs_up || 0,
          thumbs_down: item.thumbs_down || 0,
          author: item.author,
          permalink: item.permalink,
        })),
      }
    } catch {
      return { found: false, entries: [] }
    }
  })
