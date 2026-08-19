import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import uploadRoute from './routes/upload.js'
import summarizeRoute from './routes/summarize.js'
import quizRoute from './routes/quiz.js'
import flashcardsRoute from './routes/flashcards.js'
import chatRoute from './routes/chat.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

// Routes
app.use('/api/upload',     uploadRoute)
app.use('/api/summarize',  summarizeRoute)
app.use('/api/quiz',       quizRoute)
app.use('/api/flashcards', flashcardsRoute)
app.use('/api/chat',       chatRoute)

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
