import { ArrowRight, Binary, Braces, CircleDot, MousePointer2, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import binaryNetwork from '../assets/binary-command-network.png'

export function IntroScreen({ onEnter }: { onEnter: () => void }) {
  const artRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const enter = (event: KeyboardEvent) => { if (event.key === 'Enter') onEnter() }
    window.addEventListener('keydown', enter)
    return () => window.removeEventListener('keydown', enter)
  }, [onEnter])

  const moveLens = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = artRef.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top))
    element.style.setProperty('--lens-x', `${x}px`)
    element.style.setProperty('--lens-y', `${y}px`)
    element.style.setProperty('--lens-x-percent', `${(x / rect.width) * 100}%`)
    element.style.setProperty('--lens-y-percent', `${(y / rect.height) * 100}%`)
  }

  return <motion.div className="intro-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.015 }} transition={{ duration: .45 }}>
    <svg className="distortion-filter" aria-hidden="true"><filter id="signal-distortion"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.05" numOctaves="2" seed="7"><animate attributeName="baseFrequency" dur="5s" values="0.008 0.05;0.012 0.035;0.008 0.05" repeatCount="indefinite" /></feTurbulence><feDisplacementMap in="SourceGraphic" scale="9" /></filter></svg>
    <div className="intro-grid" />
    <header className="intro-header"><div className="intro-logo"><span><Terminal /></span><div><b>NØDE</b><small>DEVELOPER COMMAND CENTER / V1.0</small></div></div><div className="intro-online"><i /> SYSTEM ONLINE</div></header>
    <main className="intro-layout">
      <motion.section className="intro-message" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .15, duration: .55 }}>
        <div className="intro-kicker"><Binary /> [ KNOWLEDGE INFRASTRUCTURE ]</div>
        <h1>Everything connects.<br /><span>One NØDE.</span></h1>
        <p>Your commands, playbooks, tools, and guided labs — connected in one place and ready when you need them.</p>
        <div className="intro-metrics"><div><b>39</b><span>COMMANDS</span></div><div><b>08</b><span>DOCKER FLOWS</span></div><div><b>12</b><span>MODULES</span></div></div>
        <button className="enter-button" onClick={onEnter}><span>ENTER NØDE</span><ArrowRight /></button>
        <small className="enter-shortcut"><kbd>ENTER</kbd> to initialize workspace</small>
      </motion.section>
      <motion.section className="intro-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .12, duration: .7 }}>
        <div ref={artRef} className={`binary-art ${active ? 'lens-active' : ''}`} onPointerMove={moveLens} onPointerEnter={() => setActive(true)} onPointerLeave={() => setActive(false)}>
          <div className="art-rings"><i /><i /><i /></div>
          <img className="art-base" src={binaryNetwork} alt="Binary network connecting containers, database, storage, code, and infrastructure" />
          <img className="art-reveal" src={binaryNetwork} aria-hidden="true" />
          <div className="cursor-lens"><span /><b>DECRYPT</b></div>
          <div className="data-readout readout-one"><span>NODE.01</span><b>CONTAINER</b></div>
          <div className="data-readout readout-two"><span>LINK.STATUS</span><b>STABLE</b></div>
        </div>
        <div className="mouse-hint"><MousePointer2 /><span>MOVE CURSOR TO DECRYPT SIGNAL</span></div>
      </motion.section>
    </main>
    <footer className="intro-footer"><span><CircleDot /> LOCAL_DATABASE</span><span><Braces /> REACT / TYPESCRIPT</span><span>NØDE // DEV ENVIRONMENT</span></footer>
  </motion.div>
}
