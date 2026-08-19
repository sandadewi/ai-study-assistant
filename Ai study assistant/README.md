# AI Study Assistant

An AI-powered study guide web app that helps students turn their notes and documents into interactive study material — including summaries, flashcards, and quizzes — using the Gemini API.

## Features

- 📄 Upload PDFs/notes and get an AI-generated summary
- 🃏 Auto-generate flashcards from your material
- ❓ Auto-generate quizzes to test your understanding
- 💬 Chat with an AI assistant about your uploaded content
- 🧠 Spaced repetition scheduling (SM-2 algorithm) for flashcard review

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS
**Backend:** Node.js, Express
**AI:** Google Gemini API
**File handling:** Multer (uploads), custom PDF parser

## Project Structure

```
Ai study assistant/
├── frontend/          # React + Vite + Tailwind client
└── backend/           # Express API server
    ├── routes/         # chat, flashcards, quiz, summarize, upload
    ├── services/        # Gemini integration, PDF parsing, SM-2 scheduler
    └── middleware/       # Multer file upload config
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- A Gemini API key ([get one here](https://ai.google.dev/))

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # then add your GEMINI_API_KEY
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside `backend/` (see `.env.example`):

```
GEMINI_API_KEY=your_gemini_api_key
PORT=your_port
FRONTEND_URL=your_frontend_url
```

## Screenshots

_Add a few screenshots of the app here to make the repo stand out._

## License

This project was built as an academic/portfolio project.
