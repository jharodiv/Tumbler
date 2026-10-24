# Tumbler Frontend

Admin UI for the Tumbler IT asset tracker, built with **React 19 + TypeScript + Vite**. It talks to
[`tumbler-backend-typescript`](https://github.com/jharodiv/tumbler-backend-typescript) (Express + MongoDB).

## Getting started

1. Start the backend (see its README). By default it listens on `http://localhost:5001` and needs an admin:

   ```bash
   npm run create:admin -- --email admin@company.com --password changeme123
   npm run dev
   ```

2. Start the frontend:

   ```bash
   npm install
   cp .env.example .env   # optional, only if the backend isn't on localhost:5001
   npm run dev            # http://localhost:3000
   ```

3. Sign in with the admin account. Only `admin` users can log in. Regular users are people who hold
   equipment, and admins create them from the **Users** page.

## How it connects to the backend

- The backend uses **server-side sessions** stored in an `httpOnly` cookie, not JWTs. Axios sends
  requests with `withCredentials: true`, and the app checks who is logged in with `GET /auth/me` on load.
- In development Vite proxies `/api` to `VITE_API_PROXY_TARGET` (default `http://localhost:5001`), so the
  browser treats the cookie as same-origin and CORS doesn't come into play.
- If the session expires or is revoked, any `401` sends the user back to the login page.

## Scripts

| Script              | Description                         |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Dev server on port 3000             |
| `npm run build`     | Type-check, then build to `dist/`   |
| `npm run typecheck` | Type-check only                     |
| `npm run lint`      | ESLint                              |
| `npm run preview`   | Serve the production build          |

## Structure

```
src/
  api/          client.ts (axios + error helpers), endpoints.ts, types.ts (mirrors backend models), queryKeys.ts
  auth/         AuthProvider, useAuth, ProtectedRoute, LoginPage
  components/   Layout (sidebar), Modal, Field, Badges, Pagination, Feedback, PageHeader
  pages/        Dashboard, assets/ (list, detail, create/edit, assign/return), users/, assignments/, Categories
  hooks/, utils/
```

Server state is managed with TanStack Query. Mutations invalidate the related query keys, so lists,
detail pages and the dashboard stay in sync.
