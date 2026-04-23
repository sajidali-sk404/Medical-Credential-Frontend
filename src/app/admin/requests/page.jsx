"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RequestsTable } from "@/components/dashboard/RequestsTable";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 5;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", LIMIT);

    api.get(`/api/admin/requests?${params.toString()}`)
      .then((r) => {
        setRequests(r.data.requests);
        setTotalPages(r.data.totalPages || 1)
      })
      .finally(() => setLoading(false));
  }, [page]);
     

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform-wide overview"
      />

      {/* Recent Requests */}
      <Card>
        <CardContent className="p-5 space-y-4">

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent Requests</h2>

            {/* Optional */}
            {/* <Link href="/admin/requests" className="text-xs text-primary hover:underline">
              View all →
            </Link> */}
          </div>

          <RequestsTable
            requests={requests}
            basePath="/admin/requests"
          />

        </CardContent>
      </Card>
                <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded-md disabled:opacity-40"
        >
          ← Prev
        </button>

        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded-md disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}