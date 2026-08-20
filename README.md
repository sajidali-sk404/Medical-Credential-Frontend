# CredFlow — Frontend

Medical Credentialing Management System — Next.js frontend with role-based dashboards for Clients, Healthcare Providers, and Admins.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS + inline styles |
| HTTP Client | Axios |
| Auth | JWT via js-cookie |
| Icons | Lucide React |
| UI Components | shadcn/ui |
| Deployment | Vercel |

---

## Project Structure

```
client/
├── src/
│   └── app/
│       ├── (auth)/
│       │   ├── sign-in/page.jsx
│       │   └── sign-up/page.jsx
│       ├── (client)/
│       │   └── dashboard/
│       │       ├── layout.jsx        # Client layout + auth guard
│       │       ├── page.jsx          # Dashboard home
│       │       ├── requests/
│       │       │   ├── page.jsx      # All requests
│       │       │   └── [id]/page.jsx # Request detail
│       │       ├── new-request/
│       │       │   └── page.jsx      # Multi-step form with Provider dropdown
│       │       └── support/
│       │           └── page.jsx      # Support tickets
│       ├── provider/
│       │   ├── layout.jsx            # Provider layout + auth guard
│       │   ├── dashboard/page.jsx    # Provider dashboard
│       │   ├── requests/
│       │   │   ├── page.jsx          # Provider verification requests
│       │   │   └── [id]/page.jsx     # Request detail
│       │   ├── documents/page.jsx    # Provider document hub
│       │   ├── profile/page.jsx      # NPI & License profile
│       │   └── support/page.jsx      # Support tickets
│       ├── admin/
│       │   ├── layout.jsx            # Admin layout + auth guard
│       │   ├── dashboard/page.jsx
│       │   ├── requests/
│       │   │   ├── page.jsx
│       │   │   └── [id]/page.jsx
│       │   ├── clients/
│       │   │   ├── page.jsx
│       │   │   └── [id]/page.jsx
│       │   └── support/page.jsx
│       ├── layout.jsx                # Root layout + AuthProvider
│       └── page.jsx                  # Root redirect
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── dashboard/
│   │   ├── StatCard.jsx
│   │   └── RequestsTable.jsx
│   ├── requests/
│   │   ├── RequestForm.jsx           # Multi-step form with Provider dropdown
│   │   └── RequestCard.jsx
│   ├── StatusTimeline.jsx
│   └── DocumentUpload.jsx
├── context/
│   └── AuthContext.jsx               # Global auth state (with isProvider helper)
├── lib/
│   └── axios.js                      # Axios instance
├── modules/
│   ├── auth/ui/views/
│   │   ├── sign-in-views.jsx
│   │   └── sign-up-views.jsx
│   ├── dashboard/ui/components/
│   │   ├── dashboard-sidebar.jsx
│   │   └── dashboard-user-button.jsx
│   └── provider-dashboard/
│       └── ui/
│           ├── components/provider-sidebar.jsx
│           └── views/
├── middleware.js                     # Route protection by role (Client / Provider / Admin)
├── next.config.js
├── tailwind.config.js
├── jsconfig.json
└── .env.local
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/sajidali-sk404/Medical-Credential-Frontend.git
cd Medical-Credential-Frontend
npm install
```

### 2. Configure environment variables

Create `.env.local` in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://medical-credential-backend.onrender.com
```

### 3. Run development server

```bash
npm run dev
```

App runs at `http://localhost:3000`

---

## Route Structure

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing Page |
| `/sign-in` | Public | Login page with Demo buttons |
| `/sign-up` | Public | Registration page (Facility vs Healthcare Provider role) |
| `/dashboard` | Client only | Facility dashboard & stats |
| `/dashboard/requests` | Client only | All client credentialing requests |
| `/dashboard/requests/:id` | Client only | Request detail + documents + status history |
| `/dashboard/new-request` | Client only | Submit request with Provider selection dropdown |
| `/dashboard/support` | Client only | Submit & view support tickets |
| `/provider/dashboard` | Provider only | Provider dashboard & verification status |
| `/provider/requests` | Provider only | Assigned credentialing requests |
| `/provider/requests/:id` | Provider only | Credentialing request audit trail & document hub |
| `/provider/documents` | Provider only | Upload state licenses, NPI, and DEA certificates |
| `/provider/profile` | Provider only | Manage NPI, state licenses, and bio |
| `/provider/support` | Provider only | Support ticket portal |
| `/admin/dashboard` | Admin only | Platform analytics & critical requests |
| `/admin/requests` | Admin only | All requests with status transition controls |
| `/admin/requests/:id` | Admin only | Request verification detail + status updates |
| `/admin/clients` | Admin only | Client list & search |
| `/admin/clients/:id` | Admin only | Client profile & request history |
| `/admin/support` | Admin only | Support ticket management |

---

## Auth Flow

```
1. User logs in → POST /api/auth/login
2. Backend sets httpOnly cookie (for API calls)
3. Frontend stores JWT in js-cookie (for middleware)
4. Next.js middleware reads cookie → decodes role → redirects (Client / Provider / Admin)
5. Layout components double-check role via AuthContext
6. API calls include token via Authorization header (axios interceptor)
```

---

## Key Files

### `lib/axios.js` — Axios instance

```js
import axios from "axios"
import Cookies from "js-cookie"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = Cookies.get("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
```

### `middleware.js` — Route protection

Reads JWT from cookie, decodes role, and redirects:
- Unauthenticated → `/sign-in`
- Client on admin/provider routes → `/dashboard`
- Provider on admin/client routes → `/provider/dashboard`
- Admin on client/provider routes → `/admin/dashboard`

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | adminpassword |
| Client | client@example.com | clientpassword |
| Provider | provider@example.com | providerpassword |

---

## Scripts

```bash
npm run dev      # Development server (--webpack mode)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```
