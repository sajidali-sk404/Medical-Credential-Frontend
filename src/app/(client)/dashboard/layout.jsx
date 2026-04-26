// app/(client)/layout.jsx — temporary test
"use client"
import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
export default function ClientLayout({ children }) {
  const { user, loading, isClient } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user)     router.replace("/sign-in")
    if (!isClient) router.replace("/admin/dashboard")
  }, [user, loading, isClient])

  if (loading || !user) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 14, color: "#6b8b8b" }}>Loading...</p>
    </div>
  )

  if (!isClient) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 14, color: "#6b8b8b" }}>Redirecting...</p>
    </div>
  )

  // ← No DashboardSidebar — just render children directly
  return (
    <div style={{ minHeight: "100vh", background: "#f8faf9", padding: 32 }}>
      {children}
    </div>
  )
}