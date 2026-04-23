export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display:       "flex",
      alignItems:    "center",
      justifyContent:"space-between",
      marginBottom:  "24px",
    }}>
      <div>
        <h1 className="text-xl font-bold my-0.5 text-blue-600">{title}</h1>
        {subtitle && (
          <p style={{ margin: "2px 0 0", fontSize: "13px", color: "var(--color-text-secondary)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}