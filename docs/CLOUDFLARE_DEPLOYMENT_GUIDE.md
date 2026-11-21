# GullyVerse – Cloudflare Pages Deployment & DevOps Runbook

## 1. Automated Deployment Pipeline

GullyVerse provides two automated deployment mechanisms:

### Method A: Single-Command CLI Deployment (Immediate)
From the `memeverse` project root:
```bash
npm run deploy:cf
```
This runs:
1. `next build --webpack` – Compiles Next.js application with all 71 SSG routes.
2. `node scripts/prepare-cloudflare-pages.mjs` – Assembles `cloudflare-dist` with static chunks, HTML pages, `_headers`, `_routes.json`, and `_redirects`.
3. `npx wrangler pages deploy cloudflare-dist --project-name gullyverse --branch main` – Uploads delta changes to Cloudflare Pages edge.

---

### Method B: Remote Git CI/CD (Cloudflare Dashboard Webhook)
To connect the GitHub repository directly so every `git push origin main` triggers an autonomous remote build:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages**.
2. Select project **`gullyverse`** (or create a new connected project `gullyverse-git`).
3. Click **Settings > Builds & Deployments > Connect to Git**.
4. Select GitHub repository: `sahil24raj/Gully24Verse`.
5. Configure build settings:
   - **Framework Preset:** `Next.js (Static HTML Export)` or `None`
   - **Build command:** `npm run build:cf`
   - **Build output directory:** `cloudflare-dist`
   - **Root directory:** `memeverse`
6. Add Environment Variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: `AIzaSyBfKaXcqIEumKig4hTInAQF_dATClVJpDs`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: `chill24arena.firebaseapp.com`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `chill24arena`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: `chill24arena.firebasestorage.app`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: `809200142795`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`: `1:809200142795:web:2fbef194ab939923148e4e`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: `G-747TLQJD0Y`

---

## 2. Standby Rollback Procedures
- **Rollback to Prior Deployment:** In Cloudflare Pages > `gullyverse` > **Deployments**, locate the last green deployment and select **Rollback**.
- **Standby Vercel Deployment:** If Cloudflare edge experiences an upstream outage, the original Vercel URL (`https://gully24verse.vercel.app/`) remains untouched and ready to take traffic immediately.
