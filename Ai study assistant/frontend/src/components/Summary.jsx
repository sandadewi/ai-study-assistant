import { useState, useEffect } from 'react'
import { BookOpen, RefreshCw, Loader2 } from 'lucide-react'
import { summarizeDocument } from '../api/client'
import { toast } from 'react-hot-toast'

export default function Summary({ docId }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await summarizeDocument(docId)
      setSummary(data)
    } catch {
      toast.error('Failed to generate summary.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [docId])

  if (loading) return (
    <div className="flex flex-col items-center gap-4 py-24 text-ink-400">
      <Loader2 size={28} className="animate-spin text-sage-500" />
      <p className="font-display">Summarizing your document…</p>
    </div>
  )

  if (!summary) return null

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-sage-400" />
          <h2 className="font-display font-bold text-ink-100 text-xl">Summary</h2>
        </div>
        <button onClick={load} className="btn-ghost text-sm flex items-center gap-2">
          <RefreshCw size={14} /> Regenerate
        </button>
      </div>

      {/* Key points */}
      <div className="card space-y-3">
        <p className="text-xs font-display font-semibold text-ink-500 uppercase tracking-widest">Key points</p>
        <ul className="space-y-3">
          {summary.keyPoints?.map((point, i) => (
            <li key={i} className="flex gap-3 text-ink-200 leading-relaxed">
              <span className="mt-1 w-5 h-5 rounded-full bg-sage-500/15 text-sage-400 text-xs flex items-center justify-center flex-shrink-0 font-display font-bold">
                {i + 1}
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Full summary */}
      <div className="card">
        <p className="text-xs font-display font-semibold text-ink-500 uppercase tracking-widest mb-3">Full summary</p>
        <p className="text-ink-300 leading-relaxed">{summary.fullSummary}</p>
      </div>

      {/* Stats */}
      {summary.stats && (
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(summary.stats).map(([k, v]) => (
            <div key={k} className="card p-4 text-center">
              <p className="font-display font-bold text-2xl text-ink-100">{v}</p>
              <p className="text-ink-500 text-xs mt-1 capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
