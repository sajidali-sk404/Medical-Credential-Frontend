"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RequestsTable } from "@/components/dashboard/RequestsTable";
import api from "@/lib/axios";
import Link from "next/link";
import { FileBadge, Stethoscope, CheckCircle2, Clock, FileUp } from "lucide-react";

export default function ProviderDashboardView() {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    in_review: 0,
    rejected: 0,
    document_count: 0,
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/provider/dashboard/stats"),
      api.get("/api/provider/requests?limit=5"),
    ]).then(([s, r]) => {
      setStats(s.data);
      setRequests(r.data.requests);
    }).catch(err => {
      console.error("Error fetching provider dashboard:", err);
      setError("Failed to load provider data. Please try again.");
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-12 text-center text-gray-500">
      <p>Loading your provider portal...</p>
    </div>
  );

  if (error) return (
    <div className="py-12 text-center">
      <p className="text-red-500 mb-3">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, Dr. ${user?.name}`}
        subtitle="Healthcare Provider Credentialing & Verification Dashboard"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="./filebage.svg"
          label="Total Verifications"
          value={stats?.total}
          subLabel="Assigned to your profile"
          color="info"
        />
        <StatCard
          icon="./greentik.svg"
          label="Approved Credentials"
          value={stats?.approved}
          subLabel="Fully verified credentials"
          color="success"
        />
        <StatCard
          icon="./pendingfile.svg"
          label="In Review / Pending"
          value={(stats?.pending || 0) + (stats?.in_review || 0)}
          subLabel="Awaiting admin action"
          color="warning"
        />
        <StatCard
          icon="./filebage.svg"
          label="Uploaded Documents"
          value={stats?.document_count}
          subLabel="Medical licenses & certs"
          color="success"
        />
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Active Credentialing Requests</h3>
            <p className="text-xs text-gray-500">Monitor approval progress and upload required verification files</p>
          </div>
          <Link href="/provider/requests" className="text-xs font-medium text-teal-600 hover:text-teal-700">
            View All Requests →
          </Link>
        </div>
        <RequestsTable requests={requests} basePath="/provider/requests" />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-linear-to-br from-teal-900 to-slate-900 text-white rounded-xl flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center mb-3">
              <FileUp className="w-5 h-5 text-teal-300" />
            </div>
            <h4 className="font-semibold text-base">Document Hub</h4>
            <p className="text-xs text-teal-200/80 mt-1 max-w-xs">Upload state licenses, Board Certifications, and DEA registration certificates.</p>
            <Link href="/provider/documents" className="inline-block mt-4 text-xs font-semibold px-4 py-2 bg-teal-500 text-slate-950 rounded-lg hover:bg-teal-400 transition">
              Manage Documents
            </Link>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-base text-gray-900">Provider Profile & NPI</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">Keep your NPI number, license state, specialty, and contact details up to date.</p>
            <Link href="/provider/profile" className="inline-block mt-4 text-xs font-semibold px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
