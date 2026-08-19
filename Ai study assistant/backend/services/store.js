/**
 * Simple in-memory store.
 * In production replace this with Supabase / PostgreSQL calls.
 *
 * Stores:
 *   docs      — { docId: { filePath, text, uploadedAt } }
 *   summaries — { docId: { keyPoints, fullSummary, stats } }
 *   quizzes   — { quizId: { docId, questions } }
 *   cards     — { cardId: { docId, question, answer, easeFactor, interval, repetitions, nextReview } }
 */

export const docs      = new Map()
export const summaries = new Map()
export const quizzes   = new Map()
export const cards     = new Map()
