import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { docs, cards } from '../services/store.js'
import { prompt, parseJSON } from '../services/geminiService.js'
import { sm2, isDue } from '../services/sm2.js'

const router = Router()

const SYSTEM = `You are a flashcard creator. Given document text, return ONLY valid JSON (no markdown fences):
{
  "flashcards": [
    { "question": "string", "answer": "string" }
  ]
}
Create 10-15 flashcards. Questions should test a single concept. Answers should be concise (1-3 sentences).`

// POST /api/flashcards/generate
router.post('/generate', async (req, res, next) => {
  try {
    const { docId } = req.body
    if (!docId) return res.status(400).json({ error: 'docId is required.' })

    const doc = docs.get(docId)
    if (!doc) return res.status(404).json({ error: 'Document not found.' })

    const excerpt = doc.text.slice(0, 8000)
    const raw = await prompt(SYSTEM, `Create flashcards from:\n\n${excerpt}`)
    const data = parseJSON(raw)

    // Store each card with initial SM-2 state
    const flashcards = data.flashcards.map(fc => {
      const id = uuid()
      const card = {
        id,
        docId,
        question:    fc.question,
        answer:      fc.answer,
        easeFactor:  2.5,
        interval:    0,
        repetitions: 0,
        nextReview:  null,
      }
      cards.set(id, card)
      return card
    })

    res.json({ flashcards })
  } catch (err) {
    next(err)
  }
})

// POST /api/flashcards/review
router.post('/review', (req, res) => {
  const { cardId, rating } = req.body
  const card = cards.get(cardId)
  if (!card) return res.status(404).json({ error: 'Card not found.' })

  const updated = { ...card, ...sm2(card, rating) }
  cards.set(cardId, updated)

  res.json({
    cardId,
    nextReview: updated.nextReview,
    interval:   updated.interval,
    easeFactor: updated.easeFactor,
  })
})

// GET /api/flashcards/due/:docId
router.get('/due/:docId', (req, res) => {
  const { docId } = req.params
  const due = [...cards.values()].filter(c => c.docId === docId && isDue(c))
  res.json({ flashcards: due })
})

export default router
