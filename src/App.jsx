import { Routes, Route } from 'react-router-dom'
import LandingPage from './features/landing_page/ui/LandingPage.jsx'
import AuthPage from './features/auth/AuthPage.jsx'
import "./App.css"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/login" element={<AuthPage initialView="login" />} />
        <Route path="/auth/register" element={<AuthPage initialView="register" />} />
        <Route path="/auth/forgot-password" element={<AuthPage initialView="forgot-password" />} />
        <Route path="/auth/reset-password" element={<AuthPage initialView="reset-password" />} />
      </Routes>
    </div>
  )
}

export default App