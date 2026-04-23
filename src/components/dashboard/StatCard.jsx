export function StatCard({ icon, label, value, color = "info", subLabel,}) {
  const colorStyles = {
    info: "text-blue-600",
    warning: "text-yellow-600",
    success: "text-green-600",
    danger: "text-red-600",
    default: "text-foreground",
    neutral: "var(--color-text-tertiary)",
  };

  const iconBg = {
    info: "bg-blue-100",
    pending: "bg-yellow-100",
    approved: "bg-green-100",
    rejected: "bg-red-100",
  };

  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm hover:shadow-md transition-all duration-200">

      {/* Icon */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-lg mb-3 
        ${iconBg[label?.toLowerCase()] || "bg-blue-100"}`}
      >
        <img src={icon} alt="icon" className="w-5 h-5" />
      </div>

      {/* Label */}
      <p className="text-xs text-muted-foreground mb-1">
        {label}
      </p>

      {/* Value */}
      <p className={`text-2xl font-semibold ${colorStyles[color]}`}>
        {value ?? "—"}
      </p>
      
      {subLabel && (
        <p className={`m-0 text-sm ${colorStyles[color]}`}>
          {subLabel}
        </p>
      )}
    </div>
  );
}