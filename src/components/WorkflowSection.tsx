import { Check, ClipboardCopy, Copy, Route, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { workflowsFor, type Workflow } from '../data/workflows'

function WorkflowCard({ workflow, onCopied }: { workflow: Workflow; onCopied: () => void }) {
  const [copied, setCopied] = useState('')
  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    onCopied()
    window.setTimeout(() => setCopied(''), 1500)
  }
  const all = workflow.steps.map((step) => `# ${step.title}\n${step.command}`).join('\n\n')
  return <motion.article className="workflow-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <div className="workflow-card-head">
      <div><span className={`level level-${workflow.level}`}>{workflow.level}</span><h3>{workflow.title}</h3><p>{workflow.description}</p></div>
      <span className="step-count">{String(workflow.steps.length).padStart(2, '0')} STEPS</span>
    </div>
    <div className="workflow-steps">{workflow.steps.map((step, index) => <div className="workflow-step" key={step.command}>
      <div className="step-rail"><b>{String(index + 1).padStart(2, '0')}</b><i /></div>
      <div className="step-body"><strong>{step.title}</strong><p>{step.description}</p><div className="step-command"><code><em>$</em> {step.command}</code><button onClick={() => copy(step.command, step.command)}>{copied === step.command ? <Check /> : <Copy />}</button></div></div>
    </div>)}</div>
    <div className="workflow-result"><Sparkles /><span><b>RESULT</b>{workflow.result}</span></div>
    <button className="copy-workflow" onClick={() => copy('all', all)}>{copied === 'all' ? <Check /> : <ClipboardCopy />}{copied === 'all' ? 'COPIED PLAYBOOK' : 'COPY ALL STEPS'}</button>
  </motion.article>
}

export function WorkflowSection({ category, onCopied }: { category: string; onCopied: () => void }) {
  const items = workflowsFor(category)
  if (!items.length) return null
  return <section className="workflow-section">
    <div className="workflow-title"><div><span><Route /> COMMON PLAYBOOKS</span><h2>Build something, step by step.</h2><p>Practical sequences for tasks developers repeat every day.</p></div><small>{items.length} RECIPES LOADED</small></div>
    <div className="workflow-grid">{items.map((workflow) => <WorkflowCard key={workflow.id} workflow={workflow} onCopied={onCopied} />)}</div>
  </section>
}
