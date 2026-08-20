"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { RequestsTable } from "@/components/dashboard/RequestsTable";
import api from "@/lib/axios";

export default function ProviderRequestsView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/provider/requests`, {
        params: { status: statusFilter, page, limit: 10 }
      });
      setRequests(data.requests);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching provider requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, page]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Credentialing Requests"
        subtitle="View and manage all credential verification requests associated with your provider profile"
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status:</span>
          {["", "pending", "in_review", "approved", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => { setStatusFilter(st); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                statusFilter === st
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st === "" ? "All Requests" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            Loading requests...
          </div>
        ) : (
          <>
            <RequestsTable requests={requests} basePath="/provider/requests" />

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t text-sm">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border rounded-md disabled:opacity-40 text-xs font-medium"
                >
                  ← Previous
                </button>
                <span className="text-xs text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 border rounded-md disabled:opacity-40 text-xs font-medium"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
