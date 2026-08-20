"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FileText, Download, FolderKanban, ShieldCheck, Search, Filter } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

export default function ProviderDocumentsView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/api/provider/requests")
      .then(({ data }) => setRequests(data.requests || []))
      .catch(err => console.error("Error fetching provider documents:", err))
      .finally(() => setLoading(false));
  }, []);

  const allDocuments = requests.flatMap((req) =>
    (req.documents || []).map((doc) => ({
      ...doc,
      request_id: req._id,
      provider_name: req.provider_name,
      specialty: req.specialty,
      status: req.status
    }))
  );

  const filteredDocs = allDocuments.filter(d =>
    d.file_name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Provider Document Hub"
        subtitle="Centralized repository of medical licenses, certifications, and verification records"
      />

      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Total Files: <span className="font-semibold text-gray-900">{filteredDocs.length}</span>
        </div>
      </div>

      {/* Document Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-gray-500 text-sm">Loading documents...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            <FolderKanban className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p>No documents uploaded yet.</p>
            <p className="text-xs text-gray-400 mt-1">Open a credential request to upload license files.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div key={doc._id} className="p-4 border rounded-xl bg-gray-50/50 hover:bg-white hover:border-teal-500 transition shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      {doc.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-gray-900 truncate" title={doc.file_name}>
                    {doc.file_name}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Specialty: <span className="text-gray-600 font-medium">{doc.specialty}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs">
                  <Link
                    href={`/provider/requests/${doc.request_id}`}
                    className="text-gray-500 hover:text-gray-700 font-medium text-[11px]"
                  >
                    View Request →
                  </Link>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-teal-600 text-white rounded-md text-[11px] font-medium flex items-center gap-1 hover:bg-teal-700 transition"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
