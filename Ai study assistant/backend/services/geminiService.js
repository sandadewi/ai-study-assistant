import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const MODEL = 'gemini-2.0-flash'

/**
 * Send a single prompt with a system instruction and return the text response.
 */
export async function prompt(systemInstruction, userMessage) {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction,
  })

  const result = await model.generateContent(userMessage)
  return result.response.text()
}

/**
 * Multi-turn conversation for the chat tutor.
 * Gemini rules:
 *  - roles must be 'user' or 'model' (not 'assistant')
 *  - history must strictly alternate user → model → user → model
 *  - the LAST message must NOT be in history — it goes to sendMessage()
 *  - history must start with a 'user' message
 */
export async function chat(systemInstruction, messages) {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction,
  })

  // Convert role names: 'assistant' → 'model'
  const converted = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  // Gemini requires history to strictly alternate roles.
  // Build a clean alternating history, merging consecutive same-role messages.
  const alternating = []
  for (const msg of converted) {
    const last = alternating[alternating.length - 1]
    if (last && last.role === msg.role) {
      // Merge into previous message
      last.parts[0].text += '\n' + msg.parts[0].text
    } else {
      alternating.push({ role: msg.role, parts: [{ text: msg.parts[0].text }] })
    }
  }

  // History = everything except the last message
  // The last message must be a 'user' message sent via sendMessage()
  const history = alternating.slice(0, -1)
  const lastMessage = alternating[alternating.length - 1]?.parts[0]?.text || ''

  // Gemini history must start with 'user' — if it starts with 'model', drop it
  while (history.length > 0 && history[0].role === 'model') {
    history.shift()
  }

  const chatSession = model.startChat({ history })
  const result = await chatSession.sendMessage(lastMessage)
  return result.response.text()
}

/**
 * Parse JSON safely from a Gemini response.
 * Gemini sometimes wraps JSON in ```json ... ``` fences.
 */
export function parseJSON(text) {
  const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  return JSON.parse(clean)
}