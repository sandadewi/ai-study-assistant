import { Router } from 'express'
import { docs } from '../services/store.js'
import { chat } from '../services/geminiService.js'
import { chunkText } from '../services/pdfParser.js'

const router = Router()

// Simple keyword-based retrieval (swap with vector search in production)
function retrieveRelevantChunks(text, query, topN = 3) {
  const chunks = chunkText(text, 1500, 150)
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3)

  const scored = chunks.map((chunk, i) => {
    const lower = chunk.toLowerCase()
    const score = queryWords.reduce((acc, w) => acc + (lower.split(w).length - 1), 0)
    return { chunk, score, i }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(s => s.chunk)
}

router.post('/', async (req, res, next) => {
  try {
    const { docId, messages } = req.body
    if (!docId || !messages?.length) {
      return res.status(400).json({ error: 'docId and messages are required.' })
    }

    const doc = docs.get(docId)
    if (!doc) return res.status(404).json({ error: 'Document not found.' })

    // Retrieve relevant chunks based on the latest user message
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || ''
    const chunks = retrieveRelevantChunks(doc.text, lastUserMsg)
    const context = chunks.join('\n\n---\n\n')

    const systemPrompt = `You are a focused, expert study tutor. You answer ONLY based on the student's uploaded document.

DOCUMENT CONTEXT:
"""
${context}
"""

Rules:
- Answer concisely and clearly using only the provided context
- If the question is not covered in the document, say so honestly
- Use examples from the document when helpful
- Encourage the student to think, don't just give answers outright
- Keep responses to 3-5 sentences unless a detailed explanation is clearly needed`

    const reply = await chat(systemPrompt, messages)
    res.json({ reply })
  } catch (err) {
    next(err)
  }
})

export default router
