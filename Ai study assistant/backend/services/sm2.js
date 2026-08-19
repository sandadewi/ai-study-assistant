/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Each card tracks:
 *   easeFactor  — multiplier for interval growth (starts at 2.5)
 *   interval    — days until next review
 *   repetitions — number of successful reviews
 *
 * Rating mapping:
 *   'easy'   → quality 5
 *   'medium' → quality 3
 *   'hard'   → quality 1
 */

const QUALITY_MAP = { easy: 5, medium: 3, hard: 1 }

/**
 * Calculate the next review state for a flashcard
 * @param {{ easeFactor: number, interval: number, repetitions: number }} card
 * @param {'easy'|'medium'|'hard'} rating
 * @returns {{ easeFactor: number, interval: number, repetitions: number, nextReview: Date }}
 */
export function sm2(card, rating) {
  const q = QUALITY_MAP[rating] ?? 3
  let { easeFactor, interval, repetitions } = card

  if (q >= 3) {
    // Successful recall
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)

    repetitions += 1
  } else {
    // Failed recall — reset
    repetitions = 0
    interval = 1
  }

  // Update ease factor (clamp minimum at 1.3)
  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return { easeFactor, interval, repetitions, nextReview }
}

/**
 * Check if a card is due for review
 */
export function isDue(card) {
  if (!card.nextReview) return true
  return new Date(card.nextReview) <= new Date()
}
