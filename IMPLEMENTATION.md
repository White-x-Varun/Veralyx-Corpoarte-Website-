# VERALYX Corporate Website — Implementation Checklist

## Architecture

- **Monorepo**: `frontend/` (React + Vite), `backend/` (Express + MongoDB), `e2e/` (Playwright)
- **Frontend host**: Cloudflare Pages
- **Backend host**: Cloudflare Workers — Express runs through `httpServerHandler` with Node.js compatibility
- **Database**: MongoDB Atlas (local/memory-server for tests)
- **Storage**: Local disk (dev) / Cloudflare R2 (prod) via storage abstraction
- **Auth**: HttpOnly cookie sessions + bcrypt + CSRF for mutating admin requests
- **Accounts**: Admin operators only — no public / Pro customer accounts

## Progress

- [x] Architecture selected
- [x] Root monorepo config
- [x] Backend models, routes, auth, storage
- [x] Frontend public pages + design system
- [x] Admin dashboard
- [x] API integration
- [x] SEO, security, deployment docs
- [x] Tests (unit, integration, e2e smoke)
- [ ] Configure production Cloudflare bindings, secrets, and Pages service binding
- [ ] Run a live deployment check with Atlas and R2 credentials

## Placeholders

Company name defaults to **VERALYX** (workspace). Contact details, address, phone, WhatsApp, and client endorsements are configurable placeholders only — never invent real credentials.
