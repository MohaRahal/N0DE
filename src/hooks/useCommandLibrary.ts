import { useEffect, useMemo, useState } from 'react'
import { defaultCommands } from '../data/commands'
import type { Command, CommandDraft } from '../types/command'

const read = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch { return fallback }
}

const write = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value))

export function useCommandLibrary() {
  const [custom, setCustom] = useState<Command[]>(() => read('cc_custom', []))
  const [favorites, setFavorites] = useState<string[]>(() => read('cc_favorites', []))
  const [recent, setRecent] = useState<string[]>(() => read('cc_recent', []))
  const [usage, setUsage] = useState<Record<string, number>>(() => read('cc_usage', {}))

  useEffect(() => write('cc_custom', custom), [custom])
  useEffect(() => write('cc_favorites', favorites), [favorites])
  useEffect(() => write('cc_recent', recent), [recent])
  useEffect(() => write('cc_usage', usage), [usage])

  const commands = useMemo(() => [...custom, ...defaultCommands], [custom])
  const toggleFavorite = (id: string) => setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [id, ...items])
  const recordUse = (id: string) => {
    setUsage((values) => ({ ...values, [id]: (values[id] || 0) + 1 }))
    setRecent((items) => [id, ...items.filter((item) => item !== id)].slice(0, 20))
  }
  const saveCommand = (draft: CommandDraft, editingId?: string) => {
    if (editingId) {
      setCustom((items) => items.map((item) => item.id === editingId ? { ...draft, id: editingId, custom: true } : item))
      return
    }
    const id = `custom-${Date.now()}-${draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
    setCustom((items) => [{ ...draft, id, custom: true }, ...items])
  }
  const deleteCommand = (id: string) => {
    setCustom((items) => items.filter((item) => item.id !== id))
    setFavorites((items) => items.filter((item) => item !== id))
    setRecent((items) => items.filter((item) => item !== id))
  }

  return { commands, favorites, recent, usage, toggleFavorite, recordUse, saveCommand, deleteCommand }
}
