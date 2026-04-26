"use client"
import { useState, useEffect } from "react"
import { PageHeader } from "../../../../components/layout/PageHeader"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/Badge"
import api from "../../../../lib/axios"

export const  SupportViewPage = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ subject: "", message: "" })

  const fetchTickets = () => {
    api.get("/api/requests/support/my")
      .then(r => setTickets(r.data.tickets))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTickets() }, [])

  const update = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.subject.trim() || !form.message.trim()) {
      setError("Please fill in all fields")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      await api.post("/api/requests/support", form)
      setForm({ subject: "", message: "" })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      fetchTickets()
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">

      <PageHeader
        title="Support Center"
        subtitle="Create tickets and track responses from our team"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ───────── LEFT: FORM ───────── */}
        <div className="lg:col-span-5 space-y-4 sticky top-6 h-fit">

          {/* Create ticket card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">

            <h2 className="text-sm font-semibold mb-4">
              Create new ticket
            </h2>

            {success && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm">
                Ticket submitted successfully 🎉
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Subject (e.g. Upload issue)"
                value={form.subject}
                onChange={update("subject")}
                className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm outline-none focus:ring-2 focus:ring-black/10"
              />

              <textarea
                placeholder="Describe your issue..."
                value={form.message}
                onChange={update("message")}
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm outline-none resize-none focus:ring-2 focus:ring-black/10"
              />

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Button disabled={submitting}>
                {submitting ? "Submitting..." : "Submit ticket"}
              </Button>
            </form>
          </div>

          {/* Info card */}
          <div className="bg-white rounded-2xl shadow-sm p-5 text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-3">
              Support info
            </p>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Response time</span>
                <span className="font-medium">24h</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span className="font-medium">support@credflow.io</span>
              </div>
              <div className="flex justify-between">
                <span>Hours</span>
                <span className="font-medium">9am – 6pm</span>
              </div>
            </div>
          </div>
        </div>

        {/* ───────── RIGHT: TICKETS FEED ───────── */}
        <div className="lg:col-span-7">

          <div className="bg-white rounded-2xl shadow-sm p-6">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-semibold">
                Your tickets
              </h2>
              <span className="text-xs text-gray-400">
                {tickets.length} total
              </span>
            </div>

            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                No tickets yet — create your first one 👇
              </div>
            ) : (
              <div className="space-y-4">

                {tickets.map(ticket => (
                  <div
                    key={ticket._id}
                    className="p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition"
                  >

                    {/* header */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-semibold">
                        {ticket.subject}
                      </h3>

                      <Badge
                        label={ticket.is_resolved ? "Resolved" : "Open"}
                        variant={ticket.is_resolved ? "success" : "warning"}
                      />
                    </div>

                    {/* message */}
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {ticket.message}
                    </p>

                    {/* footer */}
                    <div className="mt-3 flex justify-between text-[11px] text-gray-400">
                      <span>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>

                      {ticket.is_resolved && (
                        <span className="text-green-600">
                          Resolved
                        </span>
                      )}
                    </div>

                    {/* resolution */}
                    {ticket.resolution_note && (
                      <div className="mt-3 text-xs bg-green-50 text-green-700 p-3 rounded-xl">
                        <span className="font-medium">Resolution: </span>
                        {ticket.resolution_note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}