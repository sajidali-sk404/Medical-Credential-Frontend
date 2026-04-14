"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/lib/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount — check if a session cookie exists
  useEffect(() => {
    api.get('/api/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await api.post('/api/auth/logout')
    setUser(null)
    window.location.href = '/sign-in'
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)