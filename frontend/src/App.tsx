import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from  './pages/Dashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
