import { Check, Clipboard, Copy } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { CommandStep } from '../types/command'

type Props = { command: string; commandId: string; steps?: CommandStep[]; onCopy: (id: string, value: string) => void }

const Tokens = ({ value }: { value: string }) => {
  const parts = value.split(/(\s+)/)
  return <>{parts.map((part, i) => {
    const className = part.startsWith('--') || /^-[a-z]/i.test(part) ? 'token-flag' : /<.+>|my-|\.com|user@/.test(part) ? 'token-param' : i === 0 ? 'token-tool' : ''
    return <span className={className} key={`${part}-${i}`}>{part}</span>
  })}</>
}

export function CommandBlock({ command, commandId, steps, onCopy }: Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value)
    onCopy(commandId, value)
    setCopied(key)
    window.setTimeout(() => setCopied(null), 1500)
  }
  const rows = steps?.length ? steps : [{ label: '', command }]
  return <div className="command-shell">
    {rows.map((row, index) => <div className="command-row-wrap" key={row.command}>
      {row.label && <div className="step-label"><span>{String(index + 1).padStart(2, '0')}</span>{row.label}</div>}
      <div className="command-row">
        <code><span className="prompt">$</span><Tokens value={row.command} /></code>
        <motion.button whileTap={{ scale: .94 }} className={`copy-button ${copied === row.command ? 'copied' : ''}`} onClick={(e) => { e.stopPropagation(); copy(row.command, row.command) }} aria-label={`Copy ${row.command}`}>
          {copied === row.command ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied === row.command ? 'COPIED' : 'COPY'}</span>
        </motion.button>
      </div>
    </div>)}
    {rows.length > 1 && <button className="copy-all" onClick={(e) => { e.stopPropagation(); copy('all', rows.map((row) => row.command).join('\n')) }}>
      {copied === 'all' ? <Check size={13} /> : <Clipboard size={13} />} {copied === 'all' ? 'COPIED ALL' : 'COPY ALL'}
    </button>}
  </div>
}
