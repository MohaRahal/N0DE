import { ChevronDown, Edit3, Star, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Command } from '../types/command'
import { outputFor } from '../data/commandOutputs'
import { CommandBlock } from './CommandBlock'

type Props = {
  item: Command; index: number; favorite: boolean; uses: number
  onCopy: (id: string, value: string) => void; onFavorite: (id: string) => void
  onEdit: (command: Command) => void; onDelete: (command: Command) => void
}

export function CommandCard({ item, index, favorite, uses, onCopy, onFavorite, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const hasDetails = item.explanation || item.example || item.parameters?.length
  return <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .035, .22) }} className="command-card">
    <div className="card-top">
      <div><div className="eyebrow"><span>{String(index + 1).padStart(2, '0')}</span> / {item.category.toUpperCase()}{item.custom && <em>CUSTOM</em>}</div><h3>{item.title}</h3><p>{item.description}</p></div>
      <motion.button whileTap={{ scale: .82 }} className={`favorite-button ${favorite ? 'active' : ''}`} onClick={() => onFavorite(item.id)} aria-label={favorite ? 'Remove favorite' : 'Add favorite'}><Star size={17} fill={favorite ? 'currentColor' : 'none'} /></motion.button>
    </div>
    <CommandBlock command={item.command} commandId={item.id} steps={item.steps} onCopy={onCopy} />
    <div className="output-preview">
      <div className="output-label"><span>OUTPUT_PREVIEW</span><i>●</i></div>
      <pre>{item.custom && item.example ? item.example : outputFor(item.id)}</pre>
    </div>
    <div className="card-footer">
      <div className="tags">{item.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}</div>
      <div className="card-actions">
        {uses > 0 && <span className="usage">USED {uses}×</span>}
        {item.custom && <><button onClick={() => onEdit(item)}><Edit3 size={13} /> Edit</button><button className="danger" onClick={() => onDelete(item)}><Trash2 size={13} /> Delete</button></>}
        {hasDetails && <button className="details-button" onClick={() => setOpen((value) => !value)}>Details <ChevronDown size={14} className={open ? 'rotate' : ''} /></button>}
      </div>
    </div>
    <AnimatePresence>{open && <motion.div className="details" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
      {item.explanation && <p>{item.explanation}</p>}
      {item.parameters?.length && <div className="parameters"><strong>PARAMETERS</strong>{item.parameters.map((p) => <div key={p.key}><code>{p.key}</code><span>{p.value}</span></div>)}</div>}
      {item.example && <div className="example"><strong>EXAMPLE OUTPUT</strong><pre>{item.example}</pre></div>}
    </motion.div>}</AnimatePresence>
  </motion.article>
}
