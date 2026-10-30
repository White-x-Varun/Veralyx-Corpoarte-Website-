# Cloudflare deployment from your computer

The site runs on Cloudflare Pages. Its `/api/*` Pages Function forwards requests to the `veralyx-api` Worker through the `VERALYX_API` service binding. The Worker uses MongoDB Atlas for data and resume files. Deploy both with Wrangler from this repository; the Cloudflare dashboard drag-and-drop uploader does not build Pages Functions.

## One-time setup

1. Install Node.js 20 or newer and npm. From the project folder, run `npm install`.
2. Sign in to Cloudflare: `npx wrangler@4 login`.
3. Create a MongoDB Atlas database/user for the `veralyx` database and allow the Worker to connect. For a quick initial launch, Atlas Network Access may require `0.0.0.0/0`; restrict it where your Atlas setup supports a safer connection path. Keep the URI private.
4. Create the Pages project named `veralyx` in Cloudflare, or let Wrangler create it when prompted by the first Pages deploy. The matching Pages URL will typically be `https://veralyx.pages.dev`.
5. Create `backend/.cloudflare.secrets` by copying `backend/.cloudflare.secrets.example`. Fill only `MONGODB_URI` (Atlas URI) and `SESSION_SECRET` (random value of at least 32 characters). The deploy script uploads these as encrypted Worker secrets alongside the first deployment. The file is ignored by Git. Do not put secrets in Wrangler config, `VITE_*` values, or Git.

The repository includes `backend/.dev.vars.example` for local Worker development. Copy it to `backend/.dev.vars` and fill in real local values; `.dev.vars` is ignored by Git.

## Seed the first admin

If the Atlas database has no admin account yet, create `backend/.env` with `MONGODB_URI`, `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD` (at least 12 characters), and `ADMIN_SEED_NAME`. Then run:

```powershell
npm run seed:admin -w backend
```

The `.env` file is ignored. If an admin already exists, skip this step.

## Deploy Worker and Pages

Use the exact Pages site origin for `-SiteUrl`. The script deploys the API Worker first, builds the frontend with same-origin `/api/v1`, then deploys Pages and its Function from `frontend/`.

```powershell
.\scripts\deploy-cloudflare.ps1 -SiteUrl https://veralyx.pages.dev
```

If you chose a different Pages project name, edit `frontend/wrangler.jsonc`'s `name` to match it, then use that project's `pages.dev` origin. The script configures `CLIENT_ORIGIN` on the Worker to the supplied origin. For a custom domain, use that domain consistently and update the Worker variable by deploying again.

## Develop against the local Pages Function

Terminal 1: copy and fill `backend/.dev.vars.example` as `backend/.dev.vars`, setting `CLIENT_ORIGIN=http://localhost:8788`, then start the Worker:

```powershell
npx wrangler@4 dev --config backend/wrangler.jsonc
```

Terminal 2: build the frontend to use same-origin API routes and run Pages locally with its Worker service binding:

```powershell
$env:VITE_API_BASE_URL = '/api/v1'
npm run build -w frontend
Push-Location frontend
npx wrangler@4 pages dev dist --service VERALYX_API=veralyx-api
Pop-Location
```

Open the local Pages URL printed by Wrangler (usually `http://localhost:8788`).

## Check after deployment

- Open `https://<your-pages-origin>/api/v1/health`; confirm the API and database are healthy.
- Check the public site, contact form, admin sign-in, and a small job application/resume upload.
- Pages must have the `VERALYX_API` service binding to the deployed Worker `veralyx-api`. The binding is recorded in `frontend/wrangler.jsonc` and is used by Wrangler deployments.

## Notes

- Worker secrets are declared as required in `backend/wrangler.jsonc`; Wrangler will report missing secrets during deployment.
- Worker variables such as cookie and upload limits are kept in `backend/wrangler.jsonc`. `CLIENT_ORIGIN` is supplied by the deployment script.
- Resume PDFs are stored in MongoDB Atlas. The 5 MB application upload limit applies, and Atlas storage capacity should be monitored.
- The Worker uses `httpServerHandler` and Node.js compatibility to run the Express app. MongoDB Atlas connections can add latency on cold starts. See [Express on Workers](https://developers.cloudflare.com/workers/tutorials/deploy-an-express-app/) and [MongoDB on Workers](https://developers.cloudflare.com/workers/databases/third-party-integrations/mongodb/).
- Pages service bindings are described in Cloudflare's [Pages bindings guide](https://developers.cloudflare.com/pages/functions/bindings/). The dashboard drag-and-drop upload does not compile Functions; use Wrangler or Git integration.
- Atlas direct connections from Workers may require allowing Cloudflare egress in Atlas Network Access. If using `0.0.0.0/0`, protect the database with a dedicated least-privilege user and a strong password.
