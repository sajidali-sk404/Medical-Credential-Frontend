"use client";
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar"
import { useAuth } from "../../../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
  


export default function ClientLayout({ children }) {
  const { user, loading, isClient } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace("/sign-in"); return }
    if (!isClient) { router.replace("/admin/dashboard"); return }
  }, [user, loading, isClient])

  // ✅ Only block UI while loading
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  // ✅ Prevent rendering before redirect happens
  if (!user || !isClient) return null;

  return (
    <SidebarProvider>
      <DashboardSidebar>
          {children}
      </DashboardSidebar>
    </SidebarProvider>
  )
}