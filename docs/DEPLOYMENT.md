# Cloudflare deployment

This project uses Cloudflare Pages for the React site, a Cloudflare Worker for the Express API, MongoDB Atlas for application data, and Cloudflare R2 for uploaded resumes. A Pages Function forwards `/api/*` requests to the API Worker so the browser uses one site origin and the admin cookies continue to work.

## Before deployment

- Push the repository to GitHub.
- Keep the existing Pages project Git-connected. Pages Functions are part of this deployment; dashboard drag-and-drop does not compile the `functions/` directory.
- Create the MongoDB Atlas database user and keep its connection string private. Use a database name such as `veralyx` in the URI: `mongodb+srv://<user>:<password>@<cluster-host>/veralyx`.
- Create an R2 bucket named `veralyx-resumes`. The Worker config binds it as `RESUME_BUCKET`.

Atlas only accepts connections from addresses in its project IP access list. If the Worker cannot connect, check this list. A broad `0.0.0.0/0` rule allows connections from anywhere; avoid it when possible. If you need it for a Worker without a fixed egress IP, use a dedicated database user with access only to the `veralyx` database and a strong password.

## 1. Seed the first admin account

Create `backend/.env` locally. This file is ignored by Git. Add:

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

The script creates the first admin and initial site settings. Keep the admin password private. If the admin already exists, the script leaves its password unchanged.

## 2. Deploy the API Worker

The Worker is configured in `backend/wrangler.jsonc` and is named `veralyx-api`. Deploy it through Cloudflare Workers Builds or from the repository root:

```powershell
npm run worker:deploy
```

For Git deployment, create/connect a Worker named `veralyx-api`, select this repository and production branch, use repository root `/`, set the deploy command to `npm run worker:deploy`, and keep the Wrangler config in the repository. Workers Builds can use the Wrangler file and package script to deploy on each push.

In the Worker’s **Settings → Variables and Secrets**, add:

| Name | Type | Value |
| --- | --- | --- |
| `MONGODB_URI` | Secret | Atlas URI for the `veralyx` database |
| `SESSION_SECRET` | Secret | Random private value, at least 32 characters |
| `CLIENT_ORIGIN` | Variable | Exact Pages site origin, such as `https://your-site.pages.dev` |

The Wrangler file already sets production cookies and the `RESUME_BUCKET` binding. Do not put database passwords or the session secret in `wrangler.jsonc`, GitHub, or `VITE_*` variables.

## 3. Connect Pages to the Worker

In the Pages project, open **Settings → Bindings → Add → Service binding**:

- Variable name: `VERALYX_API`
- Service: `veralyx-api`

Save and redeploy Pages so the binding is available to `frontend/functions/api/[[path]].js`.

Keep the Pages project root directory as `frontend`, build command as `npm run build`, and output directory as `dist`. Set these Pages build variables:

| Name | Value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://your-site.pages.dev/api/v1` |
| `VITE_SITE_URL` | `https://your-site.pages.dev` |

Replace `your-site.pages.dev` with the exact production Pages URL. These values are public URLs, not secrets. Redeploy Pages after changing them.

## 4. Check the deployment

Open `https://your-site.pages.dev/api/v1/health`. The response should report a healthy API/database connection. Then check the public site, submit a contact form, sign in at `/admin/login`, and upload a sample PDF to confirm R2 storage.

## Local Worker development

Create `backend/.dev.vars` with `MONGODB_URI`, `SESSION_SECRET`, and `CLIENT_ORIGIN`, then run `npm run worker:dev` from the repository root. Do not commit `.dev.vars` or `backend/.env`.

## Notes

- Cloudflare supports Express on Workers through `httpServerHandler`; Node.js compatibility is required. This Worker uses a current compatibility date and Mongoose 9. [Express on Workers](https://developers.cloudflare.com/workers/tutorials/deploy-an-express-app/) · [MongoDB on Workers](https://developers.cloudflare.com/workers/databases/third-party-integrations/mongodb/)
- MongoDB connections from Workers can have additional connection latency. Cloudflare recommends a Durable Object to persist connections for higher-traffic or latency-sensitive use cases. [MongoDB connection guidance](https://developers.cloudflare.com/workers/tutorials/connect-to-mongodb-atlas/)
- Pages Functions support service bindings to call a Worker. [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/)
