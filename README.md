# VERALYX

Corporate website for **VERALYX** — public marketing pages plus an admin CMS.

| Layer | Stack | Host (intended) |
| --- | --- | --- |
| Frontend | React 18, Vite, Tailwind | Cloudflare Pages |
| Backend | Express, MongoDB | Render (or any Node 20+ host) |
| Storage | Local disk (dev) / Cloudflare R2 (prod) | |
| Auth | HttpOnly session cookie, bcrypt, CSRF | Admin only |

There are **no public user accounts**. The only login is `/admin/login` for site operators.

## Prerequisites

- Node.js 20+
- MongoDB (local) or MongoDB Atlas
- npm 10+

## Setup

```bash
npm install
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Edit `backend/.env`: set `MONGODB_URI`, `SESSION_SECRET` (≥32 characters), and seed credentials.

```bash
npm run seed:admin
npm run dev
```

- Site: http://localhost:5173
- API: http://localhost:5000/api/v1/health
- Admin: http://localhost:5173/admin/login

Change the seeded admin password after first login.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Backend + frontend together |
| `npm run test` | Backend + frontend unit/integration tests |
| `npm run test:e2e` | Playwright smoke tests |
| `npm run lint` | ESLint |
| `npm run seed:admin` | Create the first admin user |

## Content policy

Veralyx contact and social links use the details supplied for the brand. Phone and address remain optional. Do not invent client endorsements or credentials; publish testimonials only after approval.

## Deploy

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
