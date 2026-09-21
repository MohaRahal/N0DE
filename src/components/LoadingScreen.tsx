import { motion } from 'framer-motion'
import { useEffect, type CSSProperties } from 'react'

const nodes = [
  { x: 12, y: 18, label: 'GIT', code: '01' },
  { x: 34, y: 9, label: 'DOCKER', code: '02' },
  { x: 68, y: 10, label: 'LINUX', code: '03' },
  { x: 88, y: 21, label: 'SSH', code: '04' },
  { x: 92, y: 58, label: 'DATA', code: '05' },
  { x: 76, y: 85, label: 'K8S', code: '06' },
  { x: 46, y: 91, label: 'NODE', code: '07' },
  { x: 17, y: 79, label: 'WEB', code: '08' },
  { x: 7, y: 49, label: 'SHELL', code: '09' },
]

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 3400)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return <motion.div className="loading-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.025, filter: 'blur(8px)' }} transition={{ duration: .55 }}>
    <div className="loading-grid" />
    <div className="loading-system-label"><span>BOOT_SEQUENCE</span><b>09 NODES DETECTED</b></div>
    <div className="node-system">
      <svg className="node-lines" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="node-link" x1="0" x2="1"><stop offset="0" stopColor="#00b8ff" stopOpacity=".15" /><stop offset="1" stopColor="#00f5d4" stopOpacity=".85" /></linearGradient></defs>
        {nodes.map((node, index) => <line key={node.code} x1={node.x * 10} y1={node.y * 6} x2="500" y2="300" pathLength="1" style={{ '--delay': `${.42 + index * .1}s` } as CSSProperties} />)}
      </svg>
      {nodes.map((node, index) => <div className="satellite-node" key={node.code} style={{ left: `${node.x}%`, top: `${node.y}%`, '--delay': `${.18 + index * .07}s` } as CSSProperties}>
        <i /><div><b>{node.label}</b><span>NODE.{node.code}</span></div>
      </div>)}
      <div className="central-node">
        <div className="central-orbit orbit-one" /><div className="central-orbit orbit-two" />
        <div className="node-core"><span>NØDE</span><small>CENTRAL</small></div>
        <div className="sync-pulse pulse-one" /><div className="sync-pulse pulse-two" />
      </div>
    </div>
    <div className="loading-progress"><div className="loading-copy"><span>CONNECTING INFRASTRUCTURE</span><b>ALL NODES SYNCHRONIZED</b></div><div className="loading-track"><i /></div><div className="loading-percent">100%</div></div>
  </motion.div>
}
