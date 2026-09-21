import { Box, Braces, ChevronLeft, CloudCog, Code2, Database, FolderClock, GitBranch, Heart, Layers3, Network, Package, Power, Search, Server, Settings2, Terminal, UtilityPole, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const categoryMeta: Record<string, { label: string; icon: LucideIcon }> = {
  git: { label: 'Git', icon: GitBranch }, docker: { label: 'Docker', icon: Box }, linux: { label: 'Linux', icon: Server }, ssh: { label: 'SSH', icon: Terminal },
  networking: { label: 'Networking', icon: Network }, databases: { label: 'Databases', icon: Database }, node: { label: 'Node / NPM', icon: Package }, react: { label: 'React', icon: Braces },
  python: { label: 'Python', icon: Code2 }, powershell: { label: 'PowerShell', icon: Power }, kubernetes: { label: 'Kubernetes', icon: CloudCog }, utilities: { label: 'Utilities', icon: UtilityPole },
}

type Props = { counts: Record<string, number>; selected: string; onSelect: (value: string) => void; open: boolean; onClose: () => void; onHome: () => void }

export function Sidebar({ counts, selected, onSelect, open, onClose, onHome }: Props) {
  const choose = (value: string) => { onSelect(value); onClose() }
  return <><div className={`mobile-scrim ${open ? 'show' : ''}`} onClick={onClose} /><aside className={`sidebar ${open ? 'open' : ''}`}>
    <div className="brand"><button className="brand-mark" onClick={onHome} title="Open NØDE home" aria-label="Open NØDE home"><Terminal size={19} /></button><div><strong>NØDE</strong><span>Developer Command Center</span></div><button className="close-sidebar" onClick={onClose}><X size={18} /></button></div>
    <nav>
      <p className="nav-label">COMMAND INDEX</p>
      <button className={selected === 'all' ? 'selected' : ''} onClick={() => choose('all')}><Layers3 /><span>All Commands</span><b>{counts.all || 0}</b></button>
      <button className={selected === 'favorites' ? 'selected' : ''} onClick={() => choose('favorites')}><Heart /><span>Favorites</span><b>{counts.favorites || 0}</b></button>
      <button className={selected === 'recent' ? 'selected' : ''} onClick={() => choose('recent')}><FolderClock /><span>Recent</span><b>{counts.recent || 0}</b></button>
      <div className="nav-divider" />
      <p className="nav-label">CATEGORIES</p>
      {Object.entries(categoryMeta).map(([key, meta]) => { const Icon = meta.icon; return <button key={key} className={selected === key ? 'selected' : ''} onClick={() => choose(key)}><Icon /><span>{meta.label}</span><b>{counts[key] || 0}</b></button> })}
    </nav>
    <div className="sidebar-bottom"><div><span className="online-dot" />SYS.READY</div><button aria-label="Settings"><Settings2 size={15} /></button></div>
    <div className="rail-hint"><ChevronLeft size={12} /></div>
  </aside></>
}
