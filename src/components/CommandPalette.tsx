import { Check, CornerDownLeft, Search, Terminal, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Command } from '../types/command'

type Props = { open: boolean; commands: Command[]; onClose: () => void; onCopy: (id: string, value: string) => void }
const match = (item: Command, q: string) => `${item.title} ${item.command} ${item.description} ${item.category} ${item.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase())

export function CommandPalette({ open, commands, onClose, onCopy }: Props) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const results = useMemo(() => commands.filter((item) => match(item, query)).slice(0, 8), [commands, query])
  useEffect(() => { if (open) { setQuery(''); setIndex(0); setCopied(false); window.setTimeout(() => input.current?.focus(), 80) } }, [open])
  useEffect(() => setIndex(0), [query])
  const select = async (item?: Command) => { if (!item) return; await navigator.clipboard.writeText(item.command); onCopy(item.id, item.command); setCopied(true); window.setTimeout(onClose, 650) }
  const keydown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)) }
    if (e.key === 'Enter') { e.preventDefault(); select(results[index]) }
    if (e.key === 'Escape') onClose()
  }
  return <AnimatePresence>{open && <div className="palette-layer"><motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} /><motion.div className="palette" initial={{ opacity: 0, scale: .97, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98 }}>
    <div className="palette-search">{copied ? <Check className="success" /> : <Search />}<input ref={input} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={keydown} placeholder={copied ? 'Command copied to clipboard' : 'Search commands, tools or descriptions...'} /><button onClick={onClose}><X /></button></div>
    <div className="palette-meta"><span>{query ? `${results.length} MATCHES` : 'QUICK COMMANDS'}</span><span>LOCAL_DATABASE / READY</span></div>
    <div className="palette-results">{results.map((item, i) => <button key={item.id} className={index === i ? 'active' : ''} onMouseEnter={() => setIndex(i)} onClick={() => select(item)}><div className="result-icon"><Terminal /></div><div><span>{item.category}</span><code>{item.command}</code><p>{item.title}</p></div>{index === i && <CornerDownLeft className="enter" />}</button>)}{!results.length && <div className="empty-palette"><Search /><strong>No commands found</strong><span>Try a tool, tag, or description.</span></div>}</div>
    <div className="palette-footer"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Copy</span><span><kbd>Esc</kbd> Close</span></div>
  </motion.div></div>}</AnimatePresence>
}
