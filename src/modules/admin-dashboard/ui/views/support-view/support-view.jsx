"use client"
import { useState, useEffect } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/lib/axios"

export const AdminSupportViewPage = () => {
  const [tickets, setTickets] = useState([])
  const [filter, setFilter] = useState("open")
  const [loading, setLoading] = useState(true)

  const [resolving, setResolving] = useState(null)
  const [activeResolveId, setActiveResolveId] = useState(null)
  const [resolutionText, setResolutionText] = useState("")

  const fetchTickets = () => {
    setLoading(true)

    const q =
      filter === "open"
        ? "?resolved=false"
        : filter === "resolved"
          ? "?resolved=true"
          : ""

    api.get(`/api/admin/support${q}`)
      .then((r) => setTickets(r.data.tickets))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTickets()
  }, [filter])

  const submitResolve = async (id) => {
    setResolving(id)

    try {
      await api.patch(`/api/admin/support/${id}/resolve`, {
        resolution_note: resolutionText || ""
      })

      setResolutionText("")
      setActiveResolveId(null)
      fetchTickets()
    } finally {
      setResolving(null)
    }
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <PageHeader
        title="Support Tickets"
        subtitle="Manage and resolve client requests"
      />

      {/* Filters */}
      <div className="flex gap-2">
        {[
          ["open", "Open"],
          ["resolved", "Resolved"],
          ["", "All"],
        ].map(([val, label]) => (
          <Button
            key={val}
            size="sm"
            variant={filter === val ? "default" : "outline"}
            onClick={() => setFilter(val)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">

        {loading ? (
          <p className="text-sm text-gray-400">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-sm text-gray-400">No tickets found.</p>
        ) : (
          tickets.map((t) => (
            <Card key={t._id} className="rounded-2xl shadow-sm">
              <CardContent className="p-5 space-y-3">

                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold">
                      {t.subject}
                    </h3>

                    <div className="flex items-center gap-2">
                      <Badge
                        label={t.is_resolved ? "Resolved" : "Open"}
                        variant={t.is_resolved ? "success" : "warning"}
                      />

                      <span className="text-xs text-gray-400">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Client info */}
                <p className="text-xs text-gray-400">
                  {t.client_id?.user_id?.name} · {t.client_id?.company_name}
                </p>

                {/* Message */}
                <p className="text-sm text-gray-600">
                  {t.message}
                </p>

                {/* Resolution note (if exists) */}
                {t.is_resolved && t.resolution_note && (
                  <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl">
                    <span className="font-medium">Resolution: </span>
                    {t.resolution_note}
                  </div>
                )}

                {/* Resolve flow */}
                {!t.is_resolved && (
                  <div className="space-y-2">

                    {activeResolveId === t._id ? (
                      <>
                        <textarea
                          placeholder="Add resolution note (optional)"
                          value={resolutionText}
                          onChange={(e) =>
                            setResolutionText(e.target.value)
                          }
                          className="w-full text-sm p-3 border rounded-xl bg-gray-50 outline-none"
                          rows={3}
                        />

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => submitResolve(t._id)}
                            disabled={resolving === t._id}
                          >
                            {resolving === t._id
                              ? "Saving..."
                              : "Confirm resolve"}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setActiveResolveId(null)
                              setResolutionText("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setActiveResolveId(t._id)}
                      >
                        Mark as resolved
                      </Button>
                    )}

                  </div>
                )}

              </CardContent>
            </Card>
          ))
        )}

      </div>
    </div>
  )
}