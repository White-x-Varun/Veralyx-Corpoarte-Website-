# Cloudflare deployment

This project uses Cloudflare Pages for the React site, a Cloudflare Worker for the Express API, and MongoDB Atlas for application data and uploaded resumes. Resume PDFs are stored in a private MongoDB collection, so deployment does not require enabling an R2 subscription. A Pages Function forwards `/api/*` requests to the API Worker so the browser uses one site origin and the admin cookies continue to work.

## Before deployment

- Push the repository to GitHub.
- Keep the Pages project Git-connected. Pages Functions are part of this deployment; dashboard drag-and-drop does not compile the `functions/` directory.
- Create a MongoDB Atlas database user with `readWrite` access to the `veralyx` database. Keep its connection string private.
- The Worker needs Atlas network access. Adding your computer's current IP is useful for the one-time local admin seed, but does not automatically allow Cloudflare Worker requests. If the health check reports an IP access-list error, review Atlas network access before opening it broadly.
- Resume uploads are limited to 5 MB and use Atlas storage capacity. Remove old applications from the admin panel to delete their stored resume data.

## 1. Seed the first admin account

If an admin account already exists in this Atlas database, skip this section. Otherwise, create `backend/.env` locally. This file is ignored by Git. Add:

```dotenv
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-host>/veralyx
ADMIN_SEED_EMAIL=you@example.com
ADMIN_SEED_PASSWORD=<a unique password with at least 12 characters>
ADMIN_SEED_NAME=Site Administrator
```

From the repository root, run:

```powershell
npm install
npm run seed:admin -w backend
```

The script creates the first admin and initial site settings. If the admin already exists, the script leaves its password unchanged.

## 2. Deploy the API Worker

The Worker configuration is in `backend/wrangler.jsonc`. It uses MongoDB Atlas for resume storage and does not need an R2 bucket. Connect the repository through Cloudflare **Workers Builds**:

- Git repository: this project
- Production branch: the same branch used by the Pages project
- Root directory: `/` (repository root)
- Build command: leave blank
- Deploy command: `npm run worker:deploy`

In the Worker's **Settings → Variables and Secrets**, add these production runtime values:

| Name | Type | Value |
| --- | --- | --- |
| `MONGODB_URI` | Secret | Atlas URI for the `veralyx` database |
| `SESSION_SECRET` | Secret | Random private value, at least 32 characters |
| `CLIENT_ORIGIN` | Variable | Exact Pages site origin, such as `https://your-site.pages.dev` |

The Wrangler file sets the other production runtime variables. Do not put the database URI or session secret in the Wrangler file, GitHub, or `VITE_*` variables.

## 3. Connect Pages to the Worker

In the **Pages project** (not the Worker), open **Settings → Bindings → Add → Service binding**:

- Variable name: `VERALYX_API`
- Service: the API Worker deployed from `backend/wrangler.jsonc` (configured as `veralyx-api`)

Save and redeploy Pages so the binding is available to `frontend/functions/api/[[path]].js`.

Keep the Pages project settings as:

- Root directory: `frontend`
- Build command: `npm run build`
- Build output directory: `dist`

In **Pages → Settings → Environment variables**, set these for the production build:

| Name | Value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://your-site.pages.dev/api/v1` |
| `VITE_SITE_URL` | `https://your-site.pages.dev` |

Replace `your-site.pages.dev` with the exact production Pages URL, then redeploy Pages.

## 4. Check the deployment

Open `https://your-site.pages.dev/api/v1/health`. The response should report a healthy API/database connection. Then check the public site, submit a contact form, sign in at `/admin/login`, and upload a sample PDF through a published job application. The application should appear in the admin panel and its PDF should download there.

## Local Worker development

Create `backend/.dev.vars` with `MONGODB_URI`, `SESSION_SECRET`, and `CLIENT_ORIGIN`, then run `npm run worker:dev` from the repository root. Do not commit `.dev.vars` or `backend/.env`.

## Notes

- Express runs on Workers through `httpServerHandler` with Node.js compatibility. [Express on Workers](https://developers.cloudflare.com/workers/tutorials/deploy-an-express-app/)
- MongoDB Atlas connections use the direct MongoDB driver protocol. Cloudflare documents this pattern for low-traffic use; each cold invocation may pay additional connection latency. [MongoDB on Workers](https://developers.cloudflare.com/workers/databases/third-party-integrations/mongodb/)
- Pages Functions use a Service binding to call the API Worker. [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/)
