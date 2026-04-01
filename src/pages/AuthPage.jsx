import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function AuthPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirected = new URLSearchParams(location.search).get('redirect')

  const [tab, setTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')

  // Register form state
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')

  const clearError = () => setError('')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginEmail || !loginPass) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    try {
      const res = await authAPI.login(loginEmail, loginPass)
      const { token } = res.data
      login(token, loginEmail)
      toast.success(`Welcome back, ${loginEmail}!`)
      navigate(-1)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!regEmail || !regPass) { setError('Please fill in all fields.'); return }
    if (regPass.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true); setError('')
    try {
      const res = await authAPI.register(regEmail, regPass)
      const { token } = res.data
      login(token, regEmail)
      toast.success(`Account created! Welcome, ${regEmail}`)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already exist.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const base = localStorage.getItem('qm_server') || 'http://localhost:8080'
    window.location.href = `${base}/oauth2/authorization/google`
  }

  return (
    <div className="auth-page">
      <div className="auth-card card shadow-lg">
        <div className="card-body p-4">
          {/* Brand */}
          <div className="text-center mb-4">
            <div style={{ fontSize: '2.5rem' }}>⚖️</div>
            <h4 className="fw-bold mt-1 mb-0">Quantity Measurement</h4>
            <p className="text-muted small mt-1">
              {redirected
                ? 'Sign in to access History & Statistics'
                : 'Sign in to your account'}
            </p>
          </div>

          {/* Tabs */}
          <ul className="nav nav-pills nav-fill mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${tab === 'login' ? 'active' : ''}`}
                onClick={() => { setTab('login'); clearError() }}
              >
                Sign In
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${tab === 'register' ? 'active' : ''}`}
                onClick={() => { setTab('register'); clearError() }}
              >
                Create Account
              </button>
            </li>
          </ul>

          {/* Error alert */}
          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              <i className="bi bi-exclamation-circle me-1" />{error}
            </div>
          )}

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold small">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 mb-2"
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Signing in…</>
                ) : (
                  <><i className="bi bi-box-arrow-in-right me-2" />Sign In</>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary w-100 mb-2"
                onClick={handleGoogleLogin}
              >
                <i className="bi bi-google me-2" />Continue with Google
              </button>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold small">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Choose a password (min 6 chars)"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Creating…</>
                ) : (
                  <><i className="bi bi-person-plus me-2" />Create Account</>
                )}
              </button>
            </form>
          )}

          {/* Back to app */}
          <hr className="my-3" />
          <button
            className="btn btn-link w-100 text-muted small text-decoration-none"
            onClick={() => navigate('/')}
          >
            <i className="bi bi-arrow-left me-1" />Back to App (use without sign in)
          </button>
        </div>
      </div>
    </div>
  )
}
