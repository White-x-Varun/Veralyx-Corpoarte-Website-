# Deployment

Frontend is a static Vite build (Cloudflare Pages). The Express API is **not** Cloudflare Workers-compatible; run it on Render, Fly, Railway, or similar.

## Cloudflare Pages (frontend)

This project is a monorepo. Cloudflare Pages hosts the static Vite frontend; the Express API and MongoDB connection must run on a Node host such as Render or Railway. Deploying only `frontend/dist` does not deploy the API or make the admin CMS work.

### Direct upload from this workspace

Use this route when the project is not connected to GitHub or GitLab. Cloudflare's Direct Upload project type cannot later be converted to Git integration; create a Git-integrated project instead if automatic deployments from pushes are required.

1. Get the public API URL from the deployed backend, including `/api/v1`.
2. Sign Wrangler in to Cloudflare and create the Pages project once:

   ```powershell
   npx --yes wrangler@4 login
   npx --yes wrangler@4 pages project create veralyx
   ```

3. From the repository root, build and deploy with the helper script:

   ```powershell
   .\scripts\deploy-cloudflare.ps1 `
     -ApiBaseUrl 'https://<api-host>/api/v1' `
     -SiteUrl 'https://veralyx.pages.dev'
   ```

   The helper builds `frontend/dist` with the provided public URLs and uploads it to the `veralyx` Pages project. Use `-ProjectName` if you chose another Pages project name. These values are embedded in the static JavaScript at build time. Do not use local `.env` values, and do not put secrets in `VITE_*` variables.

To upload through the dashboard instead, open **Workers & Pages → Create application → Get started → Drag and drop your files**, then upload `frontend/dist` after building it with the same `VITE_API_BASE_URL` and `VITE_SITE_URL` values.

For automatic Git deployments, connect the repository through Cloudflare Pages, set the repository root to `/`, the build command to `npm ci && npm run build -w frontend`, and the output directory to `frontend/dist`. Set `VITE_API_BASE_URL` and `VITE_SITE_URL` as build environment variables in the Pages project. The Git integration requires the repository to be pushed to a supported Git provider first.

After the first deployment, set the backend's `CLIENT_ORIGIN` to the exact Pages site URL. If the API and site use different registrable domains (for example, `pages.dev` and `onrender.com`), set `COOKIE_SAME_SITE=none` with `COOKIE_SECURE=true`. For a custom domain, using an API subdomain under the same domain keeps the site and API same-site and allows `COOKIE_SAME_SITE=lax`.

### Environment

#### Frontend (Cloudflare Pages)

- Build command: `npm ci && npm run build -w frontend` (or build from `frontend/` with workspace deps installed)
- Output directory: `frontend/dist`
- `VITE_API_BASE_URL` — public API origin including `/api/v1`
- `VITE_SITE_URL` — canonical site URL (no trailing slash)

SPA fallback: `frontend/public/_redirects` and `_routes.json` are already present.

#### Backend (Node host)

Required:

- `NODE_ENV=production`
- `PORT` (platform-provided)
- `MONGODB_URI`
- `CLIENT_ORIGIN` — exact frontend origin(s), comma-separated
- `SESSION_SECRET` — at least 32 characters
- `COOKIE_SECURE=true` (HTTPS)
- `COOKIE_SAME_SITE=lax` (or `none` only if API and site are on different sites **and** cookies are Secure)

Storage:

- Dev: `STORAGE_PROVIDER=local`
- Prod: `STORAGE_PROVIDER=r2` plus `R2_*` keys from `.env.example`

Seed admin once, then rotate the password. Do not leave `ADMIN_SEED_PASSWORD` in production env after first use.

## CORS and cookies

The API sets credentials cookies. `CLIENT_ORIGIN` must match the browser origin exactly. Do not use `*` with credentials.

## Health check

`GET /api/v1/health`
