"use client"
import { useState, useEffect } from "react"
import { PageHeader } from "../../../../components/layout/PageHeader"
import { RequestsTable } from "../../../../components/dashboard/RequestsTable"
import { Button } from "../../../../components/ui/button"
import api from "../../../../lib/axios"
import Link from "next/link"

const STATUS_OPTS = ["", "pending", "in_review", "approved", "rejected"]

export const RequestsViewPage = () => {
  const [requests, setRequests] = useState([])
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const LIMIT = 10;

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (status) params.append("status", status)
    params.append("page", page)
    params.append("limit", LIMIT)

    api.get(`/api/requests/my?${params.toString()}`)
      .then(r => {
        setRequests(r.data.requests)
        setTotalPages(r.data.totalPages) // 👈 important
      })
      .finally(() => setLoading(false))
  }, [status, page])

  return (
    <div>
      <PageHeader
        title="My requests"
        subtitle="All your credentialing submissions"
        action={
          <Link href="/dashboard/new-request"><Button>+ New request</Button></Link>
        }
      />

      <div className="flex gap-3 text-2xl mb-2 ">
        {STATUS_OPTS.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{
              padding: "5px 12px", fontSize: "16px", borderRadius: "20px", cursor: "pointer",
              border: "0.5px solid var(--color-border-tertiary)",
              background: status === s ? "#0d3d3d" : "var(--color-background-primary)",
              color: status === s ? "#fff" : "var(--color-text-secondary)",
            }}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <div style={{
        background: "var(--color-background-primary)",
        borderRadius: "10px",
        border: "0.5px solid var(--color-border-tertiary)",
        padding: "20px",
      }}>
        {loading
          ? <p style={{ color: "var(--color-text-tertiary)", fontSize: "13px" }}>Loading...</p>
          : <RequestsTable requests={requests} basePath="/dashboard/requests" />
        }
      </div>
      <div className="flex justify-between items-center mt-4">

        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
        >
          ← Previous
        </button>

        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
        >
          Next →
        </button>

      </div>
    </div>
  )
}