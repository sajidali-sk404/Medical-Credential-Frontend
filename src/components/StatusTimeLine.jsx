import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react"

const STATUS_CONFIG = {
  pending: {
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    icon: Clock,
  },
  in_review: {
    color: "text-blue-600",
    bg: "bg-blue-100",
    icon: Loader2,
  },
  approved: {
    color: "text-green-600",
    bg: "bg-green-100",
    icon: CheckCircle,
  },
  rejected: {
    color: "text-red-600",
    bg: "bg-red-100",
    icon: XCircle,
  },
}

export function StatusTimeline({ logs = [] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-gray-400">
        No status history yet.
      </div>
    )
  }

  return (
    <div className="relative">

      {/* vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gray-200" />

      <div className="space-y-6">
        {logs.map((log, i) => {
          const config = STATUS_CONFIG[log.new_status] || {}
          const Icon = config.icon || Clock
          const isLatest = i === 0

          return (
            <div key={log._id} className="relative flex gap-4">

              {/* timeline node */}
              <div className="relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
              </div>

              {/* content */}
              <div className={`flex-1 rounded-xl border p-4 bg-white shadow-sm ${
                isLatest ? "ring-2 ring-black/5" : ""
              }`}>

                {/* title */}
                <p className="text-sm font-semibold text-gray-900">
                  {log.old_status
                    ? `${log.old_status.replace("_", " ")} → ${log.new_status.replace("_", " ")}`
                    : `Submitted as ${log.new_status.replace("_", " ")}`}
                </p>

                {/* time */}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(log.changed_at).toLocaleString()}
                </p>

                {/* note */}
                {log.note && (
                  <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {log.note}
                  </div>
                )}

                {/* latest badge */}
                {isLatest && (
                  <span className="inline-block mt-3 text-xs px-2 py-1 rounded-md bg-black text-white">
                    Latest update
                  </span>
                )}

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}