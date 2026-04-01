import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('qm_jwt') || null)
  const [email, setEmail] = useState(() => localStorage.getItem('qm_email') || '')

  const login = useCallback((newToken, newEmail) => {
    localStorage.setItem('qm_jwt', newToken)
    localStorage.setItem('qm_email', newEmail)
    setToken(newToken)
    setEmail(newEmail)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('qm_jwt')
    localStorage.removeItem('qm_email')
    setToken(null)
    setEmail('')
  }, [])

  return (
    <AuthContext.Provider value={{ token, email, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
