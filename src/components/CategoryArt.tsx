import { motion } from 'framer-motion'
import { categoryMeta } from './Sidebar'

const binaryLines = [
  '01000100 01000101 01010110 00100000 01000101 01001110 01010110',
  '00110100 00110010 00100000 01000011 01001111 01001101 01001101',
  '01010011 01011001 01010011 00101110 01010010 01000101 01000001',
  '01001001 01001110 01000100 01000101 01011000 00100000 00110000',
  '00110001 00110000 00110001 00110001 00100000 00110000 00110001',
]

export function CategoryArt({ category, count }: { category: string; count: number }) {
  const meta = categoryMeta[category]
  if (!meta) return null
  const Icon = meta.icon
  return <motion.section className={`category-art art-${category}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={category}>
    <div className="binary-field" aria-hidden="true">{binaryLines.map((line, index) => <span key={index}>{line}</span>)}</div>
    <div className="category-art-icon"><Icon /></div>
    <div className="category-art-copy">
      <span>0{Object.keys(categoryMeta).indexOf(category) + 1} / MODULE</span>
      <h2>{meta.label}</h2>
      <p>{count} commands loaded into the local index.</p>
    </div>
    <div className="art-status"><i /> SERVICE READY</div>
  </motion.section>
}
