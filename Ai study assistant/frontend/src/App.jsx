import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Study from './pages/Study'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#2c2a22',
            color: '#e8e6df',
            border: '1px solid #433f33',
            fontFamily: '"DM Sans", sans-serif',
            borderRadius: '12px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study/:docId" element={<Study />} />
      </Routes>
    </>
  )
}
