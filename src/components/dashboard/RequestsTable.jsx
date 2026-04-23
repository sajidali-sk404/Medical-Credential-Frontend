"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export function RequestsTable({ requests = [], basePath = "/requests" }) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        No requests found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-background w-4xl">
      <div className="">
        <table className="w-full text-sm">
          
          {/* Header */}
          <thead className="bg-muted/50 border-b">
            <tr className="text-xs uppercase tracking-wide text-muted-foreground">
              <th className="text-left px-4 py-3 font-medium">Provider</th>
              <th className="text-left px-4 py-3 font-medium">Specialty</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Submitted</th>
              <th className="text-right px-4 py-3 font-medium"></th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {requests.map((req) => (
              <tr
                key={req._id}
                className="border-b last:border-none hover:bg-muted/40 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {req.provider_name}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {req.specialty}
                </td>

                <td className="px-4 py-3">
                  <Badge
                    label={req.status.replace("_", " ")}
                    variant={req.status?.toLowerCase().trim()}
                  />
                </td>

                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(req.submitted_at).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-right">
                  <Link
                    href={`${basePath}/${req._id}`}
                    className="text-primary text-xs font-medium hover:underline"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}