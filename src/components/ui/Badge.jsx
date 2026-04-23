const VARIANTS = {
  pending:   { bg: "var(--color-background-warning)", color: "var(--color-text-warning)" },
  in_review: { bg: "var(--color-background-info)",    color: "var(--color-text-info)"    },
  approved:  { bg: "var(--color-background-success)", color: "var(--color-text-success)" },
  rejected:  { bg: "var(--color-background-danger)",  color: "var(--color-text-danger)"  },
  admin:     { bg: "var(--color-background-danger)",  color: "var(--color-text-danger)"  },
  client:    { bg: "var(--color-background-info)",    color: "var(--color-text-info)"    },
  resolved:  { bg: "var(--color-background-success)", color: "var(--color-text-success)" },
  open:      { bg: "var(--color-background-warning)", color: "var(--color-text-warning)" },
}

export function Badge({ label, variant }) {
  const normalized = variant?.toLowerCase().trim()
  const style = VARIANTS[normalized] || VARIANTS["pending"]

  return (
    <span style={{
      display:      "inline-block",
      fontSize:     "12px",
      fontWeight:   500,
      padding:      "3px 9px",
      borderRadius: "20px",
      background:   style.bg,
      color:        style.color,
    }}>
      {label}
    </span>
  )
}