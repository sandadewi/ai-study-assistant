import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Loader2, Bot, User } from 'lucide-react'
import { sendChatMessage } from '../api/client'
import { toast } from 'react-hot-toast'

const STARTERS = [
  'Summarise the main argument in simple terms',
  'What are the most important concepts?',
  'Create a study plan for this material',
  'What might be asked in an exam?',
]

export default function ChatTutor({ docId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const content = text || input.trim()
    if (!content || loading) return

    const userMsg = { role: 'user', content }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = [...messages, userMsg]
      const { data } = await sendChatMessage(docId, history)
      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      toast.error('Failed to get a response.')
      setMessages(m => m.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={18} className="text-sage-400" />
        <h2 className="font-display font-bold text-ink-100 text-xl">Chat tutor</h2>
        <span className="badge bg-sage-500/10 text-sage-400 border border-sage-500/20 text-xs ml-2">
          Grounded in your notes
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="card flex items-start gap-3 border-sage-500/20 bg-sage-500/5">
              <div className="w-7 h-7 bg-sage-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-white" />
              </div>
              <div>
                <p className="font-display font-semibold text-sage-300 text-sm mb-1">StudyAI tutor</p>
                <p className="text-ink-300 leading-relaxed">
                  Hi! I've read your document and I'm ready to help you study. Ask me anything — I'll answer based on your uploaded content.
                </p>
              </div>
            </div>

            <div>
              <p className="text-ink-500 text-xs font-display font-semibold uppercase tracking-widest mb-3">Suggested questions</p>
              <div className="grid grid-cols-1 gap-2">
                {STARTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left px-4 py-3 rounded-xl border border-ink-700 hover:border-ink-500 text-ink-300 hover:text-ink-100 text-sm transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
              ${msg.role === 'user' ? 'bg-ink-700' : 'bg-sage-500'}`}>
              {msg.role === 'user'
                ? <User size={14} className="text-ink-300" />
                : <Bot size={14} className="text-white" />}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-ink-700 text-ink-200 rounded-tr-sm'
                : 'bg-ink-800 border border-ink-700 text-ink-200 rounded-tl-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-sage-500 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-ink-800 border border-ink-700 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 size={14} className="animate-spin text-sage-400" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          className="input flex-1"
          placeholder="Ask anything about your notes…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          disabled={loading}
        />
        <button
          className="btn-primary px-4 flex items-center gap-2"
          onClick={() => send()}
          disabled={!input.trim() || loading}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}
