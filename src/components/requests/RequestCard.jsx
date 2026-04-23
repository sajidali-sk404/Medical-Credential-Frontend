import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/card";

export function RequestCard({ request, basePath = "/requests" }) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 border-muted">
      <CardContent className="p-4 space-y-3">
        
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {request.provider_name}
          </h3>

          <Badge
            label={request.status.replace("_", " ")}
            variant={request.status}
          />
        </div>

        {/* Specialty */}
        <p className="text-xs text-muted-foreground">
          {request.specialty}
        </p>

        {/* Bottom Row */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-muted-foreground">
            {new Date(request.submitted_at).toLocaleDateString()}
          </span>

          <Link
            href={`${basePath}/${request._id}`}
            className="text-xs font-medium text-primary hover:underline"
          >
            View details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}