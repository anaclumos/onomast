import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { DictionaryResult, UrbanDictionaryResult } from '@/lib/types'

const wordInput = z.object({ word: z.string().min(1).max(100) })

export const checkDictionary = createServerFn({ method: 'GET' })
  .inputValidator(wordInput)
  .handler(async ({ data }): Promise<DictionaryResult> => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(data.word)}`,
        { signal: AbortSignal.timeout(10000) },
      )
      if (!res.ok) {
        return { found: false, word: data.word, phonetics: [], meanings: [] }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const json: Array<any> = await res.json()
      const entry = json[0]
      return {
        found: true,
        word: entry.word,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        phonetic: entry.phonetics?.find((p: any) => p.text)?.text,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        phonetics: (entry.phonetics || []).map((p: any) => ({
          text: p.text,
          audio: p.audio,
        })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        meanings: (entry.meanings || []).map((m: any) => ({
          partOfSpeech: m.partOfSpeech,
          definitions: (m.definitions || [])
            .slice(0, 3)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((d: any) => ({
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
        { signal: AbortSignal.timeout(10000) },
      )
      if (!res.ok) {
        return { found: false, entries: [] }
      }
      const json = await res.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list: Array<any> = json.list || []
      return {
        found: list.length > 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        entries: list.slice(0, 3).map((item: any) => ({
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
