import { Router } from 'express'
import { docs, summaries } from '../services/store.js'
import { prompt, parseJSON } from '../services/geminiService.js'

const router = Router()

const SYSTEM = `You are an expert study assistant. Given document text, return ONLY valid JSON (no markdown fences) in this exact shape:
{
  "keyPoints": ["string", ...],   // 5-8 bullet points, concise
  "fullSummary": "string",        // 3-5 sentence paragraph
  "stats": {
    "wordCount": number,
    "keyTopics": number,
    "readingMins": number
  }
}`

router.post('/', async (req, res, next) => {
  try {
    const { docId } = req.body
    if (!docId) return res.status(400).json({ error: 'docId is required.' })

    // Return cached summary if available
    if (summaries.has(docId)) return res.json(summaries.get(docId))

    const doc = docs.get(docId)
    if (!doc) return res.status(404).json({ error: 'Document not found.' })

    // Truncate to ~8000 chars to fit context safely
    const excerpt = doc.text.slice(0, 8000)

    const raw = await prompt(SYSTEM, `Summarize this document:\n\n${excerpt}`)
    const data = parseJSON(raw)

    summaries.set(docId, data)
    res.json(data)
  } catch (err) {
    next(err)
  }
})

export default router
