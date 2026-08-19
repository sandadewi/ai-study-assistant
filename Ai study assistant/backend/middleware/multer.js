import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, `${uuid()}${path.extname(file.originalname)}`),
})

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'text/plain', 'text/markdown']
  if (allowed.includes(file.mimetype)) cb(null, true)
  else cb(new Error('Only PDF, .txt, and .md files are allowed'), false)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
})
