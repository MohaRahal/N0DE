import { BookOpen, Clock3, Command as CommandIcon, FlaskConical, Heart, Menu, Plus, Route, Search, SlidersHorizontal, Sparkles, Terminal, TrendingUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { CommandCard } from './components/CommandCard'
import { CommandModal, DeleteModal } from './components/CommandModal'
import { CommandPalette } from './components/CommandPalette'
import { CategoryArt } from './components/CategoryArt'
import { WorkflowSection } from './components/WorkflowSection'
import { ExerciseSection } from './components/ExerciseSection'
import { IntroScreen } from './components/IntroScreen'
import { LoadingScreen } from './components/LoadingScreen'
import { Sidebar, categoryMeta } from './components/Sidebar'
import { useCommandLibrary } from './hooks/useCommandLibrary'
import type { Command, ViewFilter } from './types/command'
import './App.css'

const searchable = (item: Command, query: string) => `${item.title} ${item.command} ${item.description} ${item.category} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())

function App() {
  const library = useCommandLibrary()
  const [selected, setSelected] = useState(() => localStorage.getItem('node_view_category') || 'all')
  const [filter, setFilter] = useState<ViewFilter>(() => {
    const saved = localStorage.getItem('node_view_filter')
    return saved === 'favorites' || saved === 'most-used' || saved === 'recent' ? saved : 'all'
  })
  const [query, setQuery] = useState(() => localStorage.getItem('node_view_query') || '')
  const [palette, setPalette] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Command | undefined>()
  const [deleting, setDeleting] = useState<Command | undefined>()
  const [toast, setToast] = useState('')
  const [categoryTab, setCategoryTab] = useState<'commands' | 'playbooks' | 'exercises'>(() => {
    const saved = localStorage.getItem('node_view_tab')
    return saved === 'playbooks' || saved === 'exercises' ? saved : 'commands'
  })
  const [showIntro, setShowIntro] = useState(() => localStorage.getItem('node_entered') !== 'true')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPalette(true) }
      if (event.key === 'Escape') { setPalette(false); setModal(false); setDeleting(undefined); setMobileNav(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => { localStorage.setItem('node_view_category', selected) }, [selected])
  useEffect(() => { localStorage.setItem('node_view_filter', filter) }, [filter])
  useEffect(() => { localStorage.setItem('node_view_query', query) }, [query])
  useEffect(() => { localStorage.setItem('node_view_tab', categoryTab) }, [categoryTab])
  useEffect(() => {
    const saveScroll = () => localStorage.setItem('node_view_scroll', String(window.scrollY))
    window.addEventListener('scroll', saveScroll, { passive: true })
    return () => window.removeEventListener('scroll', saveScroll)
  }, [])
  useEffect(() => {
    if (!showIntro && !loading) window.requestAnimationFrame(() => window.scrollTo({ top: Number(localStorage.getItem('node_view_scroll')) || 0 }))
  }, [showIntro, loading])

  const counts = useMemo(() => {
    const values: Record<string, number> = { all: library.commands.length, favorites: library.favorites.length, recent: library.recent.length }
    library.commands.forEach((item) => { values[item.category] = (values[item.category] || 0) + 1 })
    return values
  }, [library.commands, library.favorites, library.recent])

  const filtered = useMemo(() => {
    let items = [...library.commands]
    if (selected === 'favorites' || filter === 'favorites') items = items.filter((item) => library.favorites.includes(item.id))
    else if (selected === 'recent' || filter === 'recent') items = items.filter((item) => library.recent.includes(item.id)).sort((a, b) => library.recent.indexOf(a.id) - library.recent.indexOf(b.id))
    else if (selected !== 'all') items = items.filter((item) => item.category === selected)
    if (filter === 'most-used') items.sort((a, b) => (library.usage[b.id] || 0) - (library.usage[a.id] || 0))
    if (query.trim()) items = items.filter((item) => searchable(item, query))
    return items
  }, [library.commands, library.favorites, library.recent, library.usage, selected, filter, query])

  const frequentlyUsed = [...library.commands].filter((item) => library.usage[item.id]).sort((a, b) => (library.usage[b.id] || 0) - (library.usage[a.id] || 0)).slice(0, 5)
  const copy = (_id: string, _value: string) => { library.recordUse(_id); setToast('Command copied'); window.setTimeout(() => setToast(''), 1500) }
  const viewTitle = selected === 'all' ? 'All commands' : selected === 'favorites' ? 'Favorites' : selected === 'recent' ? 'Recent commands' : categoryMeta[selected]?.label || 'Commands'
  const openCreate = () => { setEditing(undefined); setModal(true) }
  const selectView = (value: string) => { setSelected(value); setCategoryTab('commands') }
  const openHome = () => { localStorage.removeItem('node_entered'); setLoading(false); setShowIntro(true); setMobileNav(false) }

  return <div className="app-shell">
    <AnimatePresence>{showIntro && <IntroScreen onEnter={() => { setShowIntro(false); setLoading(true) }} />}</AnimatePresence>
    <AnimatePresence>{loading && <LoadingScreen onComplete={() => { localStorage.setItem('node_entered', 'true'); setLoading(false) }} />}</AnimatePresence>
    <Sidebar counts={counts} selected={selected} onSelect={selectView} open={mobileNav} onClose={() => setMobileNav(false)} onHome={openHome} />
    <main>
      <header className="topbar">
        <div className="mobile-brand"><button onClick={() => setMobileNav(true)}><Menu /></button><button className="mobile-home" onClick={openHome} title="Open NØDE home"><Terminal /></button><strong>NØDE</strong></div>
        <div className="status"><span className="online-dot" /> SYSTEM ONLINE <em>•</em> <b>LATENCY 12MS</b></div>
        <div className="header-actions"><button onClick={() => setPalette(true)}><Search /> Search <kbd>⌘ K</kbd></button><button onClick={() => { setSelected('favorites'); setFilter('all') }}><Heart /> Favorites</button><button className="add-header" onClick={openCreate}><Plus /> Add command</button></div>
      </header>

      <div className="content">
        <section className="intro">
          <div className="intro-copy"><div className="section-code">[ DEV ENVIRONMENT ]</div><h1>NØDE <span>//</span> Command Center<span>.</span></h1><p>Every tool. Every workflow. One NØDE.</p></div>
          <div className="stats"><div><CommandIcon /><span><strong>{library.commands.length}</strong> Commands</span></div><div><SlidersHorizontal /><span><strong>{Object.keys(categoryMeta).length}</strong> Categories</span></div><div><Heart /><span><strong>{library.favorites.length}</strong> Favorites</span></div></div>
        </section>

        <button className="global-search" onClick={() => setPalette(true)}><Search /><span>{query || 'Search commands, tools or descriptions...'}</span><kbd>CTRL + K</kbd></button>

        {categoryMeta[selected] && <CategoryArt category={selected} count={counts[selected] || 0} />}
        {categoryMeta[selected] && <nav className="category-tabs" aria-label={`${categoryMeta[selected].label} sections`}>
          <button className={categoryTab === 'commands' ? 'active' : ''} onClick={() => setCategoryTab('commands')}><BookOpen /> Commands <b>{counts[selected] || 0}</b></button>
          <button className={categoryTab === 'playbooks' ? 'active' : ''} onClick={() => setCategoryTab('playbooks')}><Route /> Playbooks</button>
          <button className={categoryTab === 'exercises' ? 'active' : ''} onClick={() => setCategoryTab('exercises')}><FlaskConical /> Exercises</button>
        </nav>}
        {categoryMeta[selected] && categoryTab === 'playbooks' && <WorkflowSection category={selected} onCopied={() => { setToast('Playbook copied'); window.setTimeout(() => setToast(''), 1500) }} />}
        {categoryMeta[selected] && categoryTab === 'exercises' && <ExerciseSection category={selected} onCopied={() => { setToast('Content copied'); window.setTimeout(() => setToast(''), 1500) }} />}

        {frequentlyUsed.length > 0 && selected === 'all' && !query && <section className="frequent"><div className="subhead"><span><Sparkles /> FREQUENTLY USED</span><small>BASED ON LOCAL USAGE</small></div><div className="quick-list">{frequentlyUsed.map((item) => <button key={item.id} onClick={async () => { await navigator.clipboard.writeText(item.command); copy(item.id, item.command) }}><code><i>$</i> {item.command}</code><span>{library.usage[item.id]}×</span></button>)}</div></section>}

        {(!categoryMeta[selected] || categoryTab === 'commands') && <><section className="library-head"><div><span className="section-code">COMMAND_INDEX / {String(filtered.length).padStart(3, '0')}</span><h2>{viewTitle}</h2></div><button className="mobile-add" onClick={openCreate}><Plus /> Add</button></section>
        <div className="filter-row">
          <div className="filters">{([{ id: 'all', label: 'All', icon: SlidersHorizontal }, { id: 'favorites', label: 'Favorites', icon: Heart }, { id: 'most-used', label: 'Most used', icon: TrendingUp }, { id: 'recent', label: 'Recently used', icon: Clock3 }] as const).map(({ id, label, icon: Icon }) => <button key={id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}><Icon />{label}</button>)}</div>
          <label className="inline-search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter this view..." /></label>
        </div>

        <AnimatePresence mode="popLayout"><motion.div layout className="command-grid">{filtered.map((item, index) => <CommandCard key={item.id} item={item} index={index} favorite={library.favorites.includes(item.id)} uses={library.usage[item.id] || 0} onCopy={copy} onFavorite={library.toggleFavorite} onEdit={(command) => { setEditing(command); setModal(true) }} onDelete={setDeleting} />)}</motion.div></AnimatePresence>
        {!filtered.length && <div className="empty-state"><div><Search /></div><span>NO_MATCHES_FOUND</span><h3>No commands here yet.</h3><p>Try another query or add a command to your local library.</p><button onClick={openCreate}><Plus /> Add command</button></div>}</>}
        <footer><span>NØDE // DEV COMMAND CENTER</span><span><i className="online-dot" /> SYSTEM ONLINE</span><span>v1.0.0</span></footer>
      </div>
    </main>

    <CommandPalette open={palette} commands={library.commands} onClose={() => setPalette(false)} onCopy={copy} />
    <CommandModal open={modal} editing={editing} onClose={() => setModal(false)} onSave={library.saveCommand} />
    <DeleteModal command={deleting} onClose={() => setDeleting(undefined)} onConfirm={() => { if (deleting) library.deleteCommand(deleting.id); setDeleting(undefined) }} />
    <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><span>✓</span>{toast}</motion.div>}</AnimatePresence>
  </div>
}

export default App
