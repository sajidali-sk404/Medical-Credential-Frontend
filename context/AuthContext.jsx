// context/AuthContext.jsx
"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import api from "@/lib/axios"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    console.log("Checking session...")
    api.get("/api/auth/me", { withCredentials: true })
      .then(({ data }) => {
        setUser(data)  // user object or null
        console.log("Session user:", data)
        console.log("Session active for user:", data?.name)
      })
      .catch((err) => {
        console.log("No session:", err.response?.data || err.message);
        setUser((prev) => prev ?? null);
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // ── Called immediately after a successful login ───────────────────
  // Receives the user object from the sign-in API response
  const login = (userData) => {
    setUser(userData)
  }

  // ── Clears session on both server and client ──────────────────────
  const logout = async () => {
    try {
      await api.post("/api/auth/logout")   // clears httpOnly backend cookie
    } catch { }
    Cookies.remove("token")               // clears frontend cookie
    setUser(null)
    router.push("/sign-in")
  }

  const value = {
    user,                                    // full user object or null
    loading,                                 // true during initial session check
    login,                                   // call after successful sign-in
    logout,                                  // call from navbar or any button
    isAdmin: user?.role === "admin",        // quick boolean for conditionals
    isClient: user?.role === "client",       // quick boolean for conditionals
    isLoggedIn: !!user,                      // simple truthy check
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — import this instead of useContext(AuthContext) directly
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}