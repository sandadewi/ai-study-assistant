import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { upload } from '../middleware/multer.js'
import { extractText } from '../services/pdfParser.js'
import { docs } from '../services/store.js'

const router = Router()

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })

    const docId = uuid()
    const text  = await extractText(req.file.path)

    if (!text.trim()) {
      return res.status(422).json({ error: 'Could not extract text from file.' })
    }

    docs.set(docId, {
      filePath:   req.file.path,
      filename:   req.file.originalname,
      text,
      uploadedAt: new Date(),
    })

    res.json({ docId, filename: req.file.originalname, charCount: text.length })
  } catch (err) {
    next(err)
  }
})

export default router
