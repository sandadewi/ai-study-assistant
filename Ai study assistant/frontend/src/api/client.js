import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 60000, // 60s for AI calls
})

// ── Upload ──────────────────────────────────────────────────────
export const uploadDocument = (file, onProgress) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
  })
}

// ── Summarize ───────────────────────────────────────────────────
export const summarizeDocument = (docId) =>
  api.post('/summarize', { docId })

// ── Quiz ────────────────────────────────────────────────────────
export const generateQuiz = (docId, count = 5) =>
  api.post('/quiz/generate', { docId, count })

export const submitQuiz = (quizId, answers) =>
  api.post('/quiz/submit', { quizId, answers })

// ── Flashcards ──────────────────────────────────────────────────
export const generateFlashcards = (docId) =>
  api.post('/flashcards/generate', { docId })

export const reviewFlashcard = (cardId, rating) =>
  api.post('/flashcards/review', { cardId, rating })

export const getDueFlashcards = (docId) =>
  api.get(`/flashcards/due/${docId}`)

// ── Chat tutor ──────────────────────────────────────────────────
export const sendChatMessage = (docId, messages) =>
  api.post('/chat', { docId, messages })

export default api
