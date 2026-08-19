import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Upload, BookOpen, Zap, Brain, MessageSquare } from 'lucide-react'
import { uploadDocument } from '../api/client'

const FEATURES = [
  { icon: BookOpen, label: 'Auto summaries',     color: 'text-sage-400',  desc: 'Key points extracted instantly' },
  { icon: Zap,      label: 'Quiz generator',     color: 'text-amber-400', desc: 'Test yourself with smart MCQs' },
  { icon: Brain,    label: 'Flashcards + SM-2',  color: 'text-sky-400',   desc: 'Spaced repetition scheduling' },
  { icon: MessageSquare, label: 'Chat tutor',    color: 'text-sage-400',  desc: 'Ask anything about your notes' },
]

export default function Home() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (files) => {
    const file = files[0]
    if (!file) return

    const allowed = ['application/pdf', 'text/plain', 'text/markdown']
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF, .txt, or .md files are supported.')
      return
    }

    setUploading(true)
    try {
      const { data } = await uploadDocument(file, setProgress)
      toast.success('Document uploaded!')
      navigate(`/study/${data.docId}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed.')
      setUploading(false)
      setProgress(0)
    }
  }, [navigate])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'application/pdf': [], 'text/plain': [], 'text/markdown': [] },
    disabled: uploading,
  })

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col">
      {/* Nav */}
      <nav className="border-b border-ink-800 px-6 py-4 flex items-center gap-3">
        <div className="w-7 h-7 bg-sage-500 rounded-lg flex items-center justify-center">
          <Brain size={15} className="text-white" />
        </div>
        <span className="font-display font-bold text-ink-100 text-lg">StudyAI</span>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 badge bg-sage-500/10 text-sage-400 border border-sage-500/20 mb-6">
            <Zap size={12} /> AI-powered study assistant
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold text-ink-50 leading-tight mb-4">
            Learn faster.<br />
            <span className="text-sage-400">Retain more.</span>
          </h1>
          <p className="text-ink-400 text-lg max-w-md mx-auto">
            Upload your notes or PDFs — get instant summaries, quizzes, flashcards, and an AI tutor grounded in your content.
          </p>
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={`
            w-full max-w-xl border-2 border-dashed rounded-2xl p-12
            flex flex-col items-center gap-4 cursor-pointer
            transition-all duration-200
            ${isDragActive ? 'border-sage-400 bg-sage-500/5' : 'border-ink-700 hover:border-ink-500 bg-ink-800/40'}
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="w-14 h-14 bg-ink-700 rounded-2xl flex items-center justify-center">
            <Upload size={24} className={isDragActive ? 'text-sage-400' : 'text-ink-400'} />
          </div>
          {uploading ? (
            <div className="w-full">
              <p className="text-ink-300 text-sm text-center mb-3">Uploading… {progress}%</p>
              <div className="w-full bg-ink-700 rounded-full h-1.5">
                <div
                  className="bg-sage-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-ink-200 font-display font-semibold">
                  {isDragActive ? 'Drop it here' : 'Drag & drop your file'}
                </p>
                <p className="text-ink-500 text-sm mt-1">PDF, .txt, or .md · up to 20MB</p>
              </div>
              <button className="btn-primary text-sm">Browse files</button>
            </>
          )}
        </div>

        {/* Feature pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 w-full max-w-2xl">
          {FEATURES.map(({ icon: Icon, label, color, desc }) => (
            <div key={label} className="card p-4 flex flex-col gap-2">
              <Icon size={18} className={color} />
              <p className="font-display font-semibold text-ink-200 text-sm">{label}</p>
              <p className="text-ink-500 text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
