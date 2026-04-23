"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../../../../../context/AuthContext"
import { PageHeader } from "@/components/layout/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { RequestsTable } from "@/components/dashboard/RequestsTable"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import Link from "next/link"


export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get("/api/requests/my/stats"),
      api.get("/api/requests/my?limit=5"),
    ]).then(([s, r]) => {
      setStats(s.data)
      setRequests(r.data.requests)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: "var(--color-text-tertiary)" }}>Loading...</p>

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name}`}
        subtitle="Here's your credentialing overview"
      />
 
      <div className="grid grid-cols-1  md:grid-cols-2  lg:grid-cols-4 gap-3 mb-7">
        <StatCard 
        icon="./filebage.svg" 
        label="Total submitted" 
        value={stats?.total} 
        subLabel={`${stats.weekly_change >= 0 ? "+" : ""}${stats.weekly_change}% from last week`} color={stats.weekly_change >= 0 ? "success" : "danger"}  />

        <StatCard 
        icon="./greentik.svg" 
        label="Approved" 
        value={stats?.approved} 
        subLabel={`${stats.approval_rate}% Approval Rate`} 
        color="success" />

        <StatCard 
        icon="./pendingfile.svg" 
        label="Pending" 
        value={stats?.pending} 
        subLabel="Avg 24 hour response" 
        color="warning" />

        <StatCard 
        icon="./rejectedFile.svg" 
        label="Rejected" 
        value={stats?.rejected} 
        subLabel={``} 
        color="danger" />
      </div>

      <div style={{ 
        background: "var(--color-background-primary)",
        borderRadius: "10px",
        border: "0.5px solid var(--color-border-tertiary)",
        padding: "20px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>Recent requests</p>
          <Link href="/dashboard/requests" style={{ fontSize: "12px", color: "var(--color-text-info)" }}>
            View all
          </Link>
        </div>
        <RequestsTable requests={requests} basePath="/dashboard/requests" />
      </div>
    </div>
  )
}