"use client"
import { useState, useEffect } from "react"
import { use } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/layout/PageHeader"
import { Badge } from "@/components/ui/Badge"
import { StatCard } from "@/components/dashboard/StatCard"
import { RequestsTable } from "@/components/dashboard/RequestsTable"
import api from "@/lib/axios"

export default function AdminClientDetailPage({ params }) {
  const { id } = use(params)

  const [client, setClient] = useState(null)
  const [requests, setRequests] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("requests")

  useEffect(() => {
    Promise.all([
      api.get(`/api/admin/clients/${id}`),
      api.get(`/api/admin/support?client_id=${id}`),
    ])
      .then(([c, t]) => {
        setClient(c.data)
        setRequests(c.data.requests || [])
        setTickets(t.data.tickets || [])
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading)
    return <p className="text-sm text-gray-400">Loading...</p>

  if (!client)
    return <p className="text-sm text-red-500">Client not found.</p>

  const user = client.user_id
  const initials =
    user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"

  const stats = requests.reduce(
    (acc, r) => {
      acc.total++
      acc[r.status] = (acc[r.status] || 0) + 1
      return acc
    },
    { total: 0, pending: 0, in_review: 0, approved: 0, rejected: 0 }
  )

  return (
    <div className="p-6 space-y-6">

      {/* Back */}
      <Link
        href="/admin/clients"
        className="text-lg text-gray-400 hover:text-gray-600 transition"
      >
        ← Back to clients
      </Link>

      <PageHeader
        title={user?.name || "Unknown client"}
        subtitle={client.company_name}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ───── LEFT SIDEBAR ───── */}
        <div className="lg:col-span-4 space-y-4 sticky top-6 h-fit">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">

            <div className="mx-auto rounded-full flex items-center justify-center">
              <img className="rounded-full w-20 h-20" src={user?.image} alt="" />
            </div>

            <h2 className="mt-3 text-sm font-semibold">
              {user?.name}
            </h2>

            <p className="text-xs text-gray-400">
              {user?.email}
            </p>

            <div className="mt-3 flex justify-center">
              <Badge label="Client" variant="client" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon="/filebage.svg" label="Total" value={stats.total} />
            <StatCard icon="/pendingfile.svg" label="Pending" value={stats.pending} color="warning" />
            <StatCard icon="/greentik.svg" label="Approved" value={stats.approved} color="success" />
            <StatCard icon="/rejectedFile.svg" label="Rejected" value={stats.rejected} color="danger" />
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <h3 className="text-[11px] uppercase tracking-wider text-gray-400 mb-3">
              Profile details
            </h3>

            <div className="space-y-3 text-xs">
              {[
                ["Company", client.company_name],
                ["Phone", client.phone || "—"],
                ["Address", client.address || "—"],
                ["Joined", new Date(client.createdAt).toLocaleDateString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-400">{k}</span>
                  <span className="font-medium text-right max-w-[60%]">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ───── RIGHT CONTENT ───── */}
        <div className="lg:col-span-8">

          <div className="bg-white rounded-2xl shadow-sm border w-xl overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b">
              {[
                { key: "requests", label: `Requests (${requests.length})` },
                { key: "tickets", label: `Tickets (${tickets.length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 text-sm transition ${
                    activeTab === tab.key
                      ? "border-b-2 border-black font-medium"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-5 overflow-x-auto">

              {activeTab === "requests" &&
                (requests.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-10">
                    No requests found.
                  </p>
                ) : (
                  <RequestsTable
                    requests={requests}
                    basePath="/admin/requests"
                  />
                ))}

              {activeTab === "tickets" &&
                (tickets.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-10">
                    No support tickets.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {tickets.map(t => (
                      <div
                        key={t._id}
                        className="border rounded-xl p-4 hover:bg-gray-50 transition"
                      >
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">
                            {t.subject}
                          </p>

                          <Badge
                            label={t.is_resolved ? "Resolved" : "Open"}
                            variant={t.is_resolved ? "success" : "warning"}
                          />
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                          {t.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}