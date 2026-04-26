// app/(admin)/layout.jsx
"use client"
import { useAuth } from "../../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SidebarProvider } from "../../components/ui/sidebar";
import { AdminDashboardSidebar } from "../../modules/admin-dashboard/ui/components/admin-dashboard-sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

export default function AdminLayout({ children }) {
  const { user, loading, isAdmin } = useAuth()
  const { toggleSidebar, state } = useSidebar();
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/dashboard")   // redirect clients away from admin
    }
  }, [loading, isAdmin])

  if (loading || !user) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 14, color: "#6b8b8b" }}>Loading...</p>
    </div>
  )

  if (!isAdmin) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 14, color: "#6b8b8b" }}>Redirecting...</p>
    </div>
  )

  return <SidebarProvider>
    <AdminDashboardSidebar>
      <Button className="size-4" variant="outline" onClick={toggleSidebar}>
        {(state === "collapsed" || isMobile) ? <PanelLeftOpenIcon className="size-4" /> : <PanelLeftCloseIcon className="size-4" />}
      </Button>
      {children}
    </AdminDashboardSidebar>
  </SidebarProvider>
}