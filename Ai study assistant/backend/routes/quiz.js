import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { docs, quizzes } from '../services/store.js'
import { prompt, parseJSON } from '../services/geminiService.js'

const router = Router()

const SYSTEM = `You are a quiz generator. Given document text, return ONLY valid JSON (no markdown fences) with this exact shape:
{
  "questions": [
    {
      "question": "string",
      "options": ["A text", "B text", "C text", "D text"],
      "correctIndex": 0,
      "explanation": "string"
    }
  ]
}
Make questions challenging but fair. Explanations should teach, not just state the answer.`

// POST /api/quiz/generate
router.post('/generate', async (req, res, next) => {
  try {
    const { docId, count = 5 } = req.body
    if (!docId) return res.status(400).json({ error: 'docId is required.' })

    const doc = docs.get(docId)
    if (!doc) return res.status(404).json({ error: 'Document not found.' })

    const excerpt = doc.text.slice(0, 8000)
    const raw = await prompt(
      SYSTEM,
      `Generate ${count} multiple-choice questions from this document:\n\n${excerpt}`
    )
    const data = parseJSON(raw)

    const quizId = uuid()
    quizzes.set(quizId, { docId, questions: data.questions })

    res.json({ quizId, questions: data.questions })
  } catch (err) {
    next(err)
  }
})

// POST /api/quiz/submit
router.post('/submit', (req, res) => {
  const { quizId, answers } = req.body
  const quiz = quizzes.get(quizId)
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' })

  const results = quiz.questions.map((q, i) => ({
    correct: answers[i] === q.correctIndex,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  }))

  const score = results.filter(r => r.correct).length
  res.json({ score, total: quiz.questions.length, results })
})

export default router
