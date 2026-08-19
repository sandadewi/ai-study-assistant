import fs from 'fs'
import path from 'path'
import pdfParse from 'pdf-parse'

/**
 * Extract raw text from a file (PDF, txt, or md)
 * @param {string} filePath - absolute or relative path to the file
 * @returns {Promise<string>} extracted text
 */
export async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase()

  if (ext === '.pdf') {
    const buffer = fs.readFileSync(filePath)
    const data = await pdfParse(buffer)
    return data.text
  }

  // .txt / .md — read directly
  return fs.readFileSync(filePath, 'utf-8')
}

/**
 * Split a long text into overlapping chunks for RAG / context injection
 * @param {string} text
 * @param {number} chunkSize   - characters per chunk
 * @param {number} overlap     - overlap between chunks
 * @returns {string[]}
 */
export function chunkText(text, chunkSize = 2000, overlap = 200) {
  const chunks = []
  let start = 0
  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize))
    start += chunkSize - overlap
  }
  return chunks
}
