import { AlertCircle, Check, CheckCircle2, ClipboardCopy, Code2, Copy, Eye, EyeOff, FileCode2, FlaskConical, PackageCheck, Target } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { exercisesFor, type Exercise } from '../data/exercises'
import { categoryMeta } from './Sidebar'

const CopyButton = ({ value, label = 'COPY', onCopied }: { value: string; label?: string; onCopied: () => void }) => {
  const [copied, setCopied] = useState(false)
  const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); onCopied(); window.setTimeout(() => setCopied(false), 1500) }
  return <button className="exercise-copy" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? 'COPIED' : label}</button>
}

function ExerciseCard({ exercise, onCopied }: { exercise: Exercise; onCopied: () => void }) {
  const [solutionOpen, setSolutionOpen] = useState(false)
  const [solutionMode, setSolutionMode] = useState<'guided' | 'robust'>('guided')
  const [activeFile, setActiveFile] = useState(0)
  const selectedFiles = solutionMode === 'guided' && exercise.beginnerFiles ? exercise.beginnerFiles : exercise.files
  const selectedSteps = solutionMode === 'guided' && exercise.beginnerSolution ? exercise.beginnerSolution : exercise.solution
  const allCommands = selectedSteps.map((step) => `# ${step.title}\n${step.command}`).join('\n\n')
  const changeMode = (mode: 'guided' | 'robust') => { setSolutionMode(mode); setActiveFile(0) }
  return <article className="exercise-card">
    <div className="exercise-hero">
      <div className="exercise-number">LAB / 01</div><span className={`exercise-level ${exercise.difficulty}`}>{exercise.difficulty}</span>
      <FlaskConical className="exercise-watermark" />
      <h2>{exercise.title}</h2><p>{exercise.subtitle}</p>
    </div>
    <div className="exercise-overview">
      <div><span><Code2 /> CONTEXT</span><p>{exercise.context}</p></div>
      <div><span><Target /> OBJECTIVE</span><p>{exercise.objective}</p></div>
    </div>
    <div className="exercise-columns">
      <section><h3><CheckCircle2 /> Requirements</h3><ol>{exercise.requirements.map((item, index) => <li key={item}><b>{String(index + 1).padStart(2, '0')}</b><span>{item}</span></li>)}</ol></section>
      <section><h3><PackageCheck /> What to deliver</h3><ul>{exercise.deliverables.map((item) => <li key={item}><Check /><span>{item}</span></li>)}</ul></section>
    </div>
    <div className="solution-gate">
      <div><AlertCircle /><span><strong>Try it before revealing the solution.</strong><small>The complete reference answer includes files, commands, validations, and expected outputs.</small></span></div>
      <button onClick={() => setSolutionOpen((value) => !value)}>{solutionOpen ? <EyeOff /> : <Eye />}{solutionOpen ? 'Hide resolution' : 'Reveal resolution'}</button>
    </div>
    <AnimatePresence>{solutionOpen && <motion.div className="exercise-solution" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
      <div className="solution-heading"><div><span>REFERENCE_SOLUTION</span><h3>{solutionMode === 'guided' ? 'Resolução fácil, passo a passo' : 'Resolução robusta e automatizada'}</h3><p>{solutionMode === 'guided' ? 'Indicada para quem está fazendo a atividade pela primeira vez.' : 'Inicializa o volume automaticamente e evita a cópia manual do HTML.'}</p></div><CopyButton value={allCommands} label="COPY ALL COMMANDS" onCopied={onCopied} /></div>
      <div className="solution-mode-tabs"><button className={solutionMode === 'guided' ? 'active' : ''} onClick={() => changeMode('guided')}><span>01</span><div><b>Modo fácil</b><small>Guiado, comando por comando</small></div></button><button className={solutionMode === 'robust' ? 'active' : ''} onClick={() => changeMode('robust')}><span>02</span><div><b>Modo robusto</b><small>Volume inicializado automaticamente</small></div></button></div>
      {solutionMode === 'guided' && <div className="project-tree"><span>ESTRUTURA QUE VOCÊ VAI CRIAR</span><pre>{`atividade/
├── container1/
│   ├── Dockerfile
│   └── index.html
└── container2/
    ├── Dockerfile
    └── index.html`}</pre></div>}
      <section className="solution-files"><div className="solution-section-title"><FileCode2 /><span><b>01</b> PROJECT FILES</span></div><div className="file-workbench"><div className="file-tabs">{selectedFiles.map((file, index) => <button className={index === activeFile ? 'active' : ''} onClick={() => setActiveFile(index)} key={file.name}>{file.name}</button>)}</div><div className="file-code-head"><span>{selectedFiles[activeFile].language}</span><CopyButton value={selectedFiles[activeFile].content} onCopied={onCopied} /></div><pre>{selectedFiles[activeFile].content}</pre></div></section>
      <section className="solution-steps"><div className="solution-section-title"><FlaskConical /><span><b>02</b> EXECUTION & VALIDATION</span></div>{selectedSteps.map((step, index) => <div className="exercise-step" key={step.title}><div className="exercise-step-index">{String(index + 1).padStart(2, '0')}</div><div className="exercise-step-main"><h4>{step.title}</h4><p>{step.description}</p><div className="exercise-command"><pre>{step.command}</pre><CopyButton value={step.command} onCopied={onCopied} /></div>{step.output && <div className="expected-output"><span>EXPECTED OUTPUT</span><pre>{step.output}</pre></div>}</div></div>)}</section>
    </motion.div>}</AnimatePresence>
  </article>
}

export function ExerciseSection({ category, onCopied }: { category: string; onCopied: () => void }) {
  const items = exercisesFor(category)
  const label = categoryMeta[category]?.label || category
  if (!items.length) return <section className="exercise-empty"><div><FlaskConical /></div><span>EXERCISE_INDEX / {category.toUpperCase()}</span><h2>{label} exercises are being prepared.</h2><p>The exercise tab is ready for this category. New guided labs can be added without changing the interface.</p></section>
  return <section className="exercise-section"><div className="exercise-page-title"><span><FlaskConical /> PRACTICE LAB</span><h2>Learn by building.</h2><p>Complete the challenge first, then compare your work with the reference resolution.</p></div>{items.map((exercise) => <ExerciseCard exercise={exercise} onCopied={onCopied} key={exercise.id} />)}</section>
}
