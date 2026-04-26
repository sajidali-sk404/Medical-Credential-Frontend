"use client";
import { SidebarProvider } from "../../..//components/ui/sidebar";
import { DashboardSidebar } from "../../../modules/dashboard/ui/components/dashboard-sidebar";
import { useAuth } from "../../../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

function LayoutContent({ children }) {
  const { toggleSidebar, state, isMobile } = useSidebar()

  return (
    <>
      <div className="p-2">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          {(state === "collapsed" || isMobile)
            ? <PanelLeftOpenIcon className="size-4" />
            : <PanelLeftCloseIcon className="size-4" />}
        </Button>
      </div>

      <DashboardSidebar>
        {children}
      </DashboardSidebar>
    </>
  )
}

export default function ClientLayout({ children }) {
  const { user, loading, isClient } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace("/sign-in"); return }
    if (!isClient) { router.replace("/admin/dashboard"); return }
  }, [user, loading, isClient])

  // ✅ Only block UI while loading
  // Always show loader — never white screen
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

  return (
    <SidebarProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </SidebarProvider>
  )
}