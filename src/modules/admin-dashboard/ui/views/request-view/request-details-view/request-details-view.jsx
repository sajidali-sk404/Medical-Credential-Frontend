"use client";
import { useState, useEffect } from "react";
import { use } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusTimeline } from "@/components/StatusTimeLine";
import api from "@/lib/axios";

const NEXT_STATUS = {
  pending: ["in_review"],
  in_review: ["approved", "rejected"],
  approved: [],
  rejected: [],
};

export const AdminRequestDetailViewPage = ({ params }) => {
  const { id } = use(params);

  const [request, setRequest] = useState(null);
  const [logs, setLogs] = useState([]);
  const [docs, setDocs] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchRequest = () => {
    api.get(`/api/admin/requests/${id}`)
      .then(r => {
        setRequest(r.data);
        setLogs(r.data.status_logs);
        setDocs(r.data.documents);
      })
      .finally(() => setLoading(false));
  };

  const handleDownload = async (url, name) => {
    const res = await fetch(url)
    const blob = await res.blob()

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = name
    link.click()
  }

  useEffect(() => { fetchRequest(); }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await api.patch(`/api/admin/requests/${id}/status`, {
        status: newStatus,
        note,
      });
      setNote("");
      fetchRequest();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (!request) return <div>Request not found.</div>;

  const nextStatuses = NEXT_STATUS[request.status] || [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <PageHeader
        title={request.provider_name}
        subtitle={`${request.specialty} · ${request.client_id?.user_id?.name || "Unknown client"}`}
        action={
          <Badge
            label={request.status.replace("_", " ")}
            variant={request.status}
          />
        }
      />

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

        {/* LEFT */}
        <div className="space-y-6">

          {/* Status Update */}
          {nextStatuses.length > 0 && (
            <Card>
              <CardContent className="p-5 space-y-4">
                <h2 className="text-sm font-semibold">Update Status</h2>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note (optional)..."
                  rows={2}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
                />

                <div className="flex flex-wrap gap-2">
                  {nextStatuses.map((s) => (
                    <Button
                      key={s}
                      variant={s === "rejected" ? "destructive" : "default"}
                      onClick={() => handleStatusUpdate(s)}
                      disabled={updating}
                    >
                      {updating ? "Updating..." : `Mark ${s.replace("_", " ")}`}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h2 className="text-sm font-semibold">
                Documents ({docs.length})
              </h2>

              {docs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No documents uploaded.
                </p>
              ) : (
                <div className="space-y-2">
                  {docs.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted/40 transition"
                    >
                      {/* File type */}
                      <div
                        className={`w-9 h-9 flex items-center justify-center rounded-md text-xs font-semibold
                        ${doc.file_type === "application/pdf"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"}`}
                      >
                        {doc.file_type === "application/pdf" ? "PDF" : "IMG"}
                      </div>

                      {/* Name */}
                      <div className="flex-1 text-sm font-medium truncate">
                        {doc.file_name}
                      </div>

                      {/* Action */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(doc.file_url, doc.file_name)}
                          className="text-xs px-3 py-1 rounded-md border text-gray-700 hover:bg-gray-100"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* RIGHT */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <h2 className="text-sm font-semibold">Status History</h2>
            <StatusTimeline logs={logs} />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}