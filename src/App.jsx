import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useAuth } from './context/AuthContext'

import AppLayout from './components/AppLayout'
import AuthPage from './pages/AuthPage'
import OAuthCallback from './pages/OAuthCallback'
import ComparePage from './pages/ComparePage'
import ConvertPage from './pages/ConvertPage'
import ArithmeticPage from './pages/ArithmeticPage'
import HistoryPage from './pages/HistoryPage'
import StatsPage from './pages/StatsPage'

// Guard: only allow access if logged in
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/auth?redirect=true" replace />
  return children
}

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/oauth2-callback" element={<OAuthCallback />} />

        {/* App shell — all operation pages are public */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/compare" replace />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="convert" element={<ConvertPage />} />
          <Route path="arithmetic" element={<ArithmeticPage />} />

          {/* Protected pages */}
          <Route
            path="history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="stats"
            element={
              <ProtectedRoute>
                <StatsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/compare" replace />} />
      </Routes>
    </>
  )
}
