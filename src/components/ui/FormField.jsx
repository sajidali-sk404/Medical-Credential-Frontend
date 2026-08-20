// components/ui/FormField.jsx
export function FormField({ label, error, children, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display:       "block",
          fontSize:      11,
          fontWeight:    600,
          color:         error ? "var(--color-text-danger)" : "var(--color-text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: ".04em",
          marginBottom:  6,
        }}>
          {label}
          {required && <span style={{ color: "var(--color-text-danger)", marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {error && (
        <p style={{
          fontSize:   11,
          color:      "var(--color-text-danger)",
          marginTop:  4,
          display:    "flex",
          alignItems: "center",
          gap:        2,
        }}>
          ⚠ {error}
        </p>
      )}
    </div>
  )
}