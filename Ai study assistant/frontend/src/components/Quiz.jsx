import { useState } from 'react'
import { Zap, Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { generateQuiz } from '../api/client'
import { toast } from 'react-hot-toast'

export default function Quiz({ docId }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setAnswers({})
    setSubmitted(false)
    try {
      const { data } = await generateQuiz(docId, 5)
      setQuestions(data.questions)
    } catch {
      toast.error('Failed to generate quiz.')
    } finally {
      setLoading(false)
    }
  }

  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.correctIndex).length
    : null

  if (loading) return (
    <div className="flex flex-col items-center gap-4 py-24 text-ink-400">
      <Loader2 size={28} className="animate-spin text-amber-400" />
      <p className="font-display">Generating quiz questions…</p>
    </div>
  )

  if (!questions.length) return (
    <div className="flex flex-col items-center gap-6 py-24">
      <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center">
        <Zap size={28} className="text-amber-400" />
      </div>
      <div className="text-center">
        <h2 className="font-display font-bold text-ink-100 text-2xl mb-2">Test your knowledge</h2>
        <p className="text-ink-400">Generate a quiz from your uploaded document.</p>
      </div>
      <button onClick={load} className="btn-primary">Generate quiz</button>
    </div>
  )

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-amber-400" />
          <h2 className="font-display font-bold text-ink-100 text-xl">Quiz</h2>
        </div>
        <button onClick={load} className="btn-ghost text-sm flex items-center gap-2">
          <RefreshCw size={14} /> New quiz
        </button>
      </div>

      {submitted && (
        <div className={`card flex items-center gap-4 ${score === questions.length ? 'border-sage-500/30 bg-sage-500/5' : 'border-amber-400/30 bg-amber-400/5'}`}>
          <div className="text-4xl font-display font-extrabold text-ink-100">
            {score}/{questions.length}
          </div>
          <div>
            <p className="font-display font-semibold text-ink-200">
              {score === questions.length ? '🎉 Perfect score!' : score >= questions.length / 2 ? '👍 Good effort!' : '📚 Keep studying!'}
            </p>
            <p className="text-ink-400 text-sm">Review the answers below.</p>
          </div>
        </div>
      )}

      {questions.map((q, qi) => {
        const selected = answers[qi]
        const correct = q.correctIndex
        return (
          <div key={qi} className="card space-y-4">
            <p className="font-display font-semibold text-ink-100">
              <span className="text-ink-500 mr-2">{qi + 1}.</span>{q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                let cls = 'border border-ink-700 text-ink-300 hover:border-ink-500 hover:text-ink-100'
                if (submitted) {
                  if (oi === correct) cls = 'border border-sage-500 bg-sage-500/10 text-sage-300'
                  else if (oi === selected) cls = 'border border-red-500/50 bg-red-500/10 text-red-300'
                  else cls = 'border border-ink-800 text-ink-600'
                } else if (selected === oi) {
                  cls = 'border border-amber-400 bg-amber-400/10 text-amber-300'
                }

                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                    className={`w-full text-left px-4 py-3 rounded-xl font-body text-sm transition-all duration-150 flex items-center gap-3 ${cls}`}
                  >
                    {submitted && oi === correct && <CheckCircle2 size={15} className="text-sage-400 flex-shrink-0" />}
                    {submitted && oi === selected && oi !== correct && <XCircle size={15} className="text-red-400 flex-shrink-0" />}
                    <span className="font-mono text-xs text-ink-600 flex-shrink-0">
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {submitted && q.explanation && (
              <p className="text-ink-400 text-sm border-t border-ink-700 pt-3 leading-relaxed">
                💡 {q.explanation}
              </p>
            )}
          </div>
        )
      })}

      {!submitted && (
        <button
          className="btn-primary w-full"
          disabled={Object.keys(answers).length < questions.length}
          onClick={() => setSubmitted(true)}
        >
          Submit answers ({Object.keys(answers).length}/{questions.length} answered)
        </button>
      )}
    </div>
  )
}
