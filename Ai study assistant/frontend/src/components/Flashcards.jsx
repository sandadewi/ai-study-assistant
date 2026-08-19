import { useState } from 'react'
import { Brain, Loader2, RotateCcw, ThumbsUp, ThumbsDown, Minus } from 'lucide-react'
import { generateFlashcards, reviewFlashcard } from '../api/client'
import { toast } from 'react-hot-toast'

export default function Flashcards({ docId }) {
  const [cards, setCards] = useState([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await generateFlashcards(docId)
      setCards(data.flashcards)
      setCurrent(0)
      setFlipped(false)
      setDone([])
    } catch {
      toast.error('Failed to generate flashcards.')
    } finally {
      setLoading(false)
    }
  }

  const rate = async (rating) => {
    const card = cards[current]
    try {
      await reviewFlashcard(card.id, rating)
    } catch { /* non-blocking */ }

    setDone(d => [...d, { id: card.id, rating }])
    if (current + 1 < cards.length) {
      setCurrent(c => c + 1)
      setFlipped(false)
    } else {
      setCurrent(cards.length) // signal done
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center gap-4 py-24 text-ink-400">
      <Loader2 size={28} className="animate-spin text-sky-400" />
      <p className="font-display">Creating flashcards…</p>
    </div>
  )

  if (!cards.length) return (
    <div className="flex flex-col items-center gap-6 py-24">
      <div className="w-16 h-16 bg-sky-400/10 rounded-2xl flex items-center justify-center">
        <Brain size={28} className="text-sky-400" />
      </div>
      <div className="text-center">
        <h2 className="font-display font-bold text-ink-100 text-2xl mb-2">Flashcards</h2>
        <p className="text-ink-400">Auto-generated flashcards with spaced repetition.</p>
      </div>
      <button onClick={load} className="btn-primary">Generate flashcards</button>
    </div>
  )

  if (current >= cards.length) return (
    <div className="flex flex-col items-center gap-6 py-24">
      <div className="text-5xl">🎉</div>
      <div className="text-center">
        <h2 className="font-display font-bold text-ink-100 text-2xl mb-2">Session complete!</h2>
        <p className="text-ink-400">{cards.length} cards reviewed.</p>
        <div className="flex gap-4 justify-center mt-3 text-sm">
          <span className="text-sage-400">{done.filter(d => d.rating === 'easy').length} easy</span>
          <span className="text-amber-400">{done.filter(d => d.rating === 'medium').length} medium</span>
          <span className="text-red-400">{done.filter(d => d.rating === 'hard').length} hard</span>
        </div>
      </div>
      <button onClick={load} className="btn-primary flex items-center gap-2">
        <RotateCcw size={15} /> New session
      </button>
    </div>
  )

  const card = cards[current]

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-sky-400" />
          <h2 className="font-display font-bold text-ink-100 text-xl">Flashcards</h2>
        </div>
        <span className="text-ink-500 font-mono text-sm">{current + 1} / {cards.length}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-ink-800 rounded-full h-1">
        <div className="bg-sky-400 h-1 rounded-full transition-all duration-300" style={{ width: `${(current / cards.length) * 100}%` }} />
      </div>

      {/* Card */}
      <div
        className="card min-h-[240px] cursor-pointer select-none flex flex-col items-center justify-center gap-4 text-center hover:border-ink-600 transition-colors"
        onClick={() => setFlipped(f => !f)}
      >
        <span className="badge bg-sky-400/10 text-sky-400 border border-sky-400/20 text-xs">
          {flipped ? 'Answer' : 'Question — tap to reveal'}
        </span>
        <p className="font-display font-semibold text-ink-100 text-xl max-w-md leading-relaxed">
          {flipped ? card.answer : card.question}
        </p>
        {!flipped && (
          <p className="text-ink-600 text-xs mt-2">Click to flip</p>
        )}
      </div>

      {/* Rating buttons */}
      {flipped && (
        <div className="grid grid-cols-3 gap-3 animate-fade-up">
          <button
            onClick={() => rate('hard')}
            className="card flex flex-col items-center gap-2 py-4 hover:border-red-500/40 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <ThumbsDown size={18} className="text-red-400" />
            <span className="font-display font-semibold text-ink-300 text-sm">Hard</span>
            <span className="text-ink-600 text-xs">Review soon</span>
          </button>
          <button
            onClick={() => rate('medium')}
            className="card flex flex-col items-center gap-2 py-4 hover:border-amber-400/40 hover:bg-amber-400/5 transition-all cursor-pointer"
          >
            <Minus size={18} className="text-amber-400" />
            <span className="font-display font-semibold text-ink-300 text-sm">Medium</span>
            <span className="text-ink-600 text-xs">In a few days</span>
          </button>
          <button
            onClick={() => rate('easy')}
            className="card flex flex-col items-center gap-2 py-4 hover:border-sage-500/40 hover:bg-sage-500/5 transition-all cursor-pointer"
          >
            <ThumbsUp size={18} className="text-sage-400" />
            <span className="font-display font-semibold text-ink-300 text-sm">Easy</span>
            <span className="text-ink-600 text-xs">Long interval</span>
          </button>
        </div>
      )}
    </div>
  )
}
