# CredFlow — Frontend

Medical Credentialing Management System — Next.js frontend with role-based dashboards for clients and admins.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
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
│       │       │   └── page.jsx      # Multi-step form
│       │       └── support/
│       │           └── page.jsx      # Support tickets
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
│   │   ├── RequestForm.jsx           # Multi-step form
│   │   └── RequestCard.jsx
│   ├── StatusTimeline.jsx
│   └── DocumentUpload.jsx
├── context/
│   └── AuthContext.jsx               # Global auth state
├── lib/
│   └── api.js                        # Axios instance
├── modules/
│   ├── auth/ui/views/
│   │   ├── sign-in-views.jsx
│   │   └── sign-up-views.jsx
│   └── dashboard/ui/components/
│       ├── dashboard-sidebar.jsx
│       └── dashboard-user-button.jsx
├── middleware.js                     # Route protection by role
├── next.config.js
├── tailwind.config.js
├── jsconfig.json
└── .env.local
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/credflow-frontend.git
cd credflow-frontend
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
| `/` | Public | Redirects to sign-in or dashboard |
| `/sign-in` | Public | Login page |
| `/sign-up` | Public | Registration page |
| `/dashboard` | Client only | Stats + recent requests |
| `/dashboard/requests` | Client only | All requests list |
| `/dashboard/requests/:id` | Client only | Request detail + docs + timeline |
| `/dashboard/new-request` | Client only | Submit new request (3-step form) |
| `/dashboard/support` | Client only | Submit + view support tickets |
| `/admin/dashboard` | Admin only | Platform stats |
| `/admin/requests` | Admin only | All requests + status filter |
| `/admin/requests/:id` | Admin only | Detail + status update |
| `/admin/clients` | Admin only | Client list + search |
| `/admin/clients/:id` | Admin only | Client profile + request history |
| `/admin/support` | Admin only | All support tickets |

---

## Auth Flow

```
1. User logs in → POST /api/auth/login
2. Backend sets httpOnly cookie (for API calls)
3. Frontend stores JWT in js-cookie (for middleware)
4. Next.js middleware reads cookie → decodes role → redirects accordingly
5. Layout components double-check role via AuthContext
6. API calls include token via Authorization header (axios interceptor)
```

---

## Key Files

### `lib/api.js` — Axios instance

```js
import axios   from "axios"
import Cookies from "js-cookie"

const api = axios.create({
  baseURL:         process.env.NEXT_PUBLIC_API_URL,
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
- Client on admin routes → `/dashboard`
- Admin on client routes → `/admin/dashboard`

### `context/AuthContext.jsx` — Global user state

Provides `user`, `loading`, `isAdmin`, `isClient`, `login()`, `logout()` to all components.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | adminpassword |
| Client | client@example.com | clientpassword |

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel dashboard
3. Add environment variable: `NEXT_PUBLIC_API_URL` = your Render backend URL
4. Deploy

Vercel auto-deploys on every push to `main`.

---

## Dependencies

```bash
npm install axios js-cookie lucide-react
npm install @radix-ui/react-* # shadcn/ui components
```

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |
