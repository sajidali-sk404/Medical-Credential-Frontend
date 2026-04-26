"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { StatCard } from "../../../../components/dashboard/StatCard";
import { RequestsTable } from "../../../../components/dashboard/RequestsTable";
import { Card, CardContent } from "../../../../components/ui/card";
import api from "../../../../lib/axios";


export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_review: 0,
    approved: 0,
    rejected: 0,
    open_tickets: 0,
    weekly_change: 0,
    approval_rate: 0,
    critical_count: 0,
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/admin/dashboard/stats"),
      api.get("/api/admin/requests?limit=8"),
    ])
      .then(([s, r]) => {
        setStats(s.data);
        setRequests(r.data.requests);
      })
      .finally(() => setLoading(false));
  }, []);

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

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon="/filebage.svg"
          label="Total submitted"
          value={stats?.total}
          subLabel={`${stats.weekly_change >= 0 ? "+" : ""}${stats.weekly_change}% from last week`} color={stats.weekly_change >= 0 ? "success" : "danger"}
        />

        <StatCard
          icon="/greentik.svg"
          label="Approved"
          value={stats?.approved}
          subLabel={`${stats.approval_rate}% Approval Rate`}
          color="success"
        />

        <StatCard
          icon="/pendingfile.svg"
          label="Pending"
          value={stats?.pending}
          subLabel="Avg 24 hour response"
          color="warning"
        />
        <StatCard
          icon="/rejectedFile.svg"
          label="Rejected" value={stats?.rejected}
          color="danger"
        />
        <StatCard
          icon="/openticketsfile.svg"
          label="Open tickets"
          value={stats?.open_tickets}
          subLabel={stats.critical_count > 0 ? `${stats.critical_count} Critical status` : "All clear"}
          color={stats.critical_count > 0 ? "danger" : "success"}
        />
      </div>

      {/* Recent Requests */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent Requests</h2>

            {/* Optional View All */}
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

    </div>
  );
}