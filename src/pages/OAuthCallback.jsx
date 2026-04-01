import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function OAuthCallback() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      toast.error('OAuth login failed: ' + error)
      navigate('/auth')
      return
    }

    if (token) {
      // Decode email from JWT payload
      let email = ''
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(
          decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          )
        )
        email = payload.sub || payload.email || ''
      } catch (_) {}

      login(token, email)
      toast.success(`Welcome${email ? ', ' + email : ''}!`)
      navigate('/')
    } else {
      toast.error('Login failed. No token received.')
      navigate('/auth')
    }
  }, [searchParams])

  return (
    <div className="auth-page">
      <div className="text-center text-white">
        <div className="spinner-border mb-3" role="status" />
        <div>Completing sign in…</div>
      </div>
    </div>
  )
}
