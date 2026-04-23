// components/layout/Navbar.jsx
"use client"
import Link          from "next/link"
import { useAuth }   from "../../../context/AuthContext"

const CLIENT_LINKS = [
  { href: "/dashboard",    label: "Dashboard"    },
  { href: "/requests",     label: "My requests"  },
  { href: "/new-request",  label: "New request"  },
]

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/requests",  label: "Requests"  },
  { href: "/admin/clients",   label: "Clients"   },
  { href: "/admin/support",   label: "Support"   },
]

export function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const links = isAdmin ? ADMIN_LINKS : CLIENT_LINKS

  return (
    <nav style={{
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      padding:        "0 24px",
      height:         "56px",
      borderBottom:   "0.5px solid var(--color-border-tertiary)",
      background:     "var(--color-background-primary)",
    }}>

      {/* Logo */}
      <span style={{ fontWeight: 500, fontSize: "15px" }}>
        CredFlow
        {isAdmin && (
          <span style={{
            marginLeft:      "8px",
            fontSize:        "10px",
            background:      "var(--color-background-danger)",
            color:           "var(--color-text-danger)",
            padding:         "2px 7px",
            borderRadius:    "20px",
            fontWeight:      500,
          }}>
            Admin
          </span>
        )}
      </span>

      {/* Nav links — different per role */}
      <div style={{ display: "flex", gap: "4px" }}>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding:      "6px 12px",
              borderRadius: "6px",
              fontSize:     "13px",
              color:        "var(--color-text-secondary)",
              textDecoration: "none",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* User info + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
          {user?.name}
        </span>
        <button
          onClick={logout}
          style={{
            fontSize:     "12px",
            padding:      "5px 12px",
            border:       "0.5px solid var(--color-border-secondary)",
            borderRadius: "6px",
            background:   "transparent",
            cursor:       "pointer",
            color:        "var(--color-text-secondary)",
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}