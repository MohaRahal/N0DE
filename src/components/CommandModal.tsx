import { AlertTriangle, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Command, CommandDraft } from '../types/command'
import { categoryMeta } from './Sidebar'

type Props = { open: boolean; editing?: Command; onClose: () => void; onSave: (draft: CommandDraft, id?: string) => void }
const empty: CommandDraft = { title: '', command: '', description: '', category: 'utilities', tags: [], example: '' }

export function CommandModal({ open, editing, onClose, onSave }: Props) {
  const [form, setForm] = useState<CommandDraft>(empty)
  const [tagText, setTagText] = useState('')
  useEffect(() => { if (open) { setForm(editing ? { title: editing.title, command: editing.command, description: editing.description, category: editing.category, tags: editing.tags, example: editing.example || '' } : empty); setTagText(editing?.tags.join(', ') || '') } }, [open, editing])
  const update = (key: 'title' | 'command' | 'description' | 'category' | 'example', value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event: React.FormEvent) => { event.preventDefault(); onSave({ ...form, tags: tagText.split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean) }, editing?.id); onClose() }
  return <AnimatePresence>{open && <div className="modal-layer"><motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} /><motion.form className="command-modal" initial={{ opacity: 0, scale: .97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .97 }} onSubmit={submit}>
    <div className="modal-head"><div><span>[ LOCAL DATABASE ]</span><h2>{editing ? 'Edit command' : 'Add new command'}</h2><p>{editing ? 'Update your custom command.' : 'Store something useful for later.'}</p></div><button type="button" onClick={onClose}><X /></button></div>
    <div className="form-grid">
      <label>Title<input required value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Restart Nginx" /></label>
      <label>Category<select value={form.category} onChange={(e) => update('category', e.target.value)}>{Object.entries(categoryMeta).map(([key, item]) => <option value={key} key={key}>{item.label}</option>)}</select></label>
      <label className="span-2">Command<textarea required rows={2} value={form.command} onChange={(e) => update('command', e.target.value)} placeholder="sudo systemctl restart nginx" /></label>
      <label className="span-2">Description<input required value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="What does this command do?" /></label>
      <label className="span-2">Tags <span>comma separated</span><input value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="nginx, server, linux" /></label>
      <label className="span-2">Output example <span>optional</span><textarea rows={3} value={form.example} onChange={(e) => update('example', e.target.value)} placeholder="Paste a short example of what appears in the terminal" /></label>
    </div>
    <div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button type="submit" className="primary">{editing ? 'Save changes' : 'Save command'}</button></div>
  </motion.form></div>}</AnimatePresence>
}

export function DeleteModal({ command, onClose, onConfirm }: { command?: Command; onClose: () => void; onConfirm: () => void }) {
  return <AnimatePresence>{command && <div className="modal-layer"><motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} /><motion.div className="delete-modal" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
    <div className="warning-icon"><AlertTriangle /></div><h2>Delete command?</h2><p><strong>{command.title}</strong> will be permanently removed from your local library.</p><div className="modal-actions"><button className="secondary" onClick={onClose}>Keep it</button><button className="delete-confirm" onClick={onConfirm}>Delete command</button></div>
  </motion.div></div>}</AnimatePresence>
}
