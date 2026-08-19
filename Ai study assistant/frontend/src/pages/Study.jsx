import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, Zap, Brain, MessageSquare, ArrowLeft } from 'lucide-react'
import Summary from '../components/Summary'
import Quiz from '../components/Quiz'
import Flashcards from '../components/Flashcards'
import ChatTutor from '../components/ChatTutor'

const TABS = [
  { id: 'summary',    label: 'Summary',    icon: BookOpen,       color: 'text-sage-400' },
  { id: 'quiz',       label: 'Quiz',       icon: Zap,            color: 'text-amber-400' },
  { id: 'flashcards', label: 'Flashcards', icon: Brain,          color: 'text-sky-400' },
  { id: 'chat',       label: 'Chat tutor', icon: MessageSquare,  color: 'text-sage-400' },
]

export default function Study() {
  const { docId } = useParams()
  const [activeTab, setActiveTab] = useState('summary')

  const renderTab = () => {
    switch (activeTab) {
      case 'summary':    return <Summary docId={docId} />
      case 'quiz':       return <Quiz docId={docId} />
      case 'flashcards': return <Flashcards docId={docId} />
      case 'chat':       return <ChatTutor docId={docId} />
      default:           return null
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col">
      {/* Nav */}
      <nav className="border-b border-ink-800 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="text-ink-400 hover:text-ink-200 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="w-7 h-7 bg-sage-500 rounded-lg flex items-center justify-center">
          <Brain size={15} className="text-white" />
        </div>
        <span className="font-display font-bold text-ink-100 text-lg">StudyAI</span>
        <div className="ml-auto badge bg-ink-700 text-ink-400 font-mono text-xs">
          doc:{docId?.slice(0, 8)}
        </div>
      </nav>

      {/* Tabs */}
      <div className="border-b border-ink-800 px-6">
        <div className="flex gap-1 max-w-2xl">
          {TABS.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-2 px-4 py-3.5 text-sm font-display font-semibold
                border-b-2 transition-all duration-150
                ${activeTab === id
                  ? `border-sage-500 ${color}`
                  : 'border-transparent text-ink-500 hover:text-ink-300'}
              `}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-8 max-w-3xl w-full mx-auto">
        {renderTab()}
      </main>
    </div>
  )
}
