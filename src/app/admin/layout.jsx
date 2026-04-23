// app/(admin)/layout.jsx
"use client"
import { useAuth } from "../../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminDashboardSidebar } from "@/modules/admin-dashboard/ui/components/admin-dashboard-sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AdminLayout({ children }) {
    const { loading, isAdmin } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.replace("/dashboard")   // redirect clients away from admin
        }
    }, [loading, isAdmin])

    if (loading || !isAdmin) return null

    return <SidebarProvider>
        <AdminDashboardSidebar>
            {children}
        </AdminDashboardSidebar>
    </SidebarProvider>
}