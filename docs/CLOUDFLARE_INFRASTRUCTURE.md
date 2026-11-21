# GullyVerse – Cloudflare Infrastructure Architecture & Operations Manual

## 1. Architectural Overview

GullyVerse is a real-time multiplayer casual gaming platform built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Three.js, Canvas engines, and Unity WebGL modules. 

The production infrastructure architecture is structured to operate entirely within the **Cloudflare Free Plan** tier, maintaining complete separation from and zero disruption to existing Firebase Authentication and Firestore Database services.

```
                    ┌──────────────────────────────────────────────┐
                    │               Global End-Users               │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │       Cloudflare Global Anycast Edge         │
                    │   - DDoS Layer 3/4/7 Mitigation              │
                    │   - Free Universal SSL/TLS Full (Strict)     │
                    │   - Managed WAF & Bot Fight Mode             │
                    │   - Cloudflare Turnstile Challenge           │
                    └──────────────────────┬───────────────────────┘
                                           │
                 ┌─────────────────────────┴────────────────────────┐
                 │                                                  │
                 ▼ Static Assets & Cached Cache                      ▼ Dynamic Requests & APIs
     ┌───────────────────────┐                          ┌───────────────────────────┐
     │  Cloudflare CDN Edge  │                          │ Next.js App Router Origin │
     │  - Unity WebGL (br)   │                          │ - App Pages & Routing     │
     │  - 3D Models (.glb)   │                          │ - Server-Side APIs        │
     │  - Audio (.mp3/.ogg)  │                          │ - Game Session Validation │
     │  - Next Static Bundles│                          └─────────────┬─────────────┘
     │  - Img/Brand Assets   │                                        │
     └───────────────────────┘                                        ▼
                                                        ┌───────────────────────────┐
                                                        │ Firebase Backend Services │
                                                        │ - Firebase Auth (OAuth)   │
                                                        │ - Firestore Database      │
                                                        │ (Strictly Untouched)      │
                                                        └───────────────────────────┘
```

---

## 2. Configured Services (Cloudflare Free Plan)

| Service | Target Configuration | Free Tier Quota / Parameters | Current Status |
|---|---|---|---|
| **Cloudflare Pages / Workers** | Next.js App Router frontend hosting | Unlimited static requests; 100k free edge requests/day | Configured via `wrangler.jsonc` & `_routes.json` |
| **Edge CDN & Caching** | Static assets, Unity WebGL builds, 3D glTF/GLB models | Free unmetered bandwidth on global Anycast edge | Configured via `public/_headers` |
| **Cloudflare SSL/TLS** | Full (Strict), Universal SSL, TLS 1.3, HTTPS redirect | Free included | Automated via Cloudflare Edge |
| **Cloudflare Turnstile** | Smart, friction-free CAPTCHA replacement for bot defense | 1,000,000 challenge siteverifies / month free | Code integrated in `turnstile.ts` & `TurnstileWidget.tsx` |
| **Cloudflare R2** | Game assets, promotional banners, game thumbnails | 10 GB storage/month, 10M Class B (read) free | Architecture & CORS policy established |
| **Security & WAF** | Security headers, CSP, Anti-DDoS, Bot Fight Mode | Free DDoS & basic rate limiting | Strict CSP & Headers in `_headers` |

---

## 3. Deployment Process

### A. Git-Based Deployment (Recommended)
1. In Cloudflare Dashboard, navigate to **Compute (Workers & Pages)** > **Create** > **Pages**.
2. Connect the GitHub repository `https://github.com/sahil24raj/Chill-Arena24`.
3. Set configuration:
   - **Framework Preset**: Next.js
   - **Root Directory**: `memeverse`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `.next`
   - **Environment Variables**: Configure Firebase public keys (`NEXT_PUBLIC_FIREBASE_*`) and `GAME_SESSION_SECRET`.
4. Cloudflare automatically generates a deployment preview URL (e.g., `https://gullyverse-<hash>.pages.dev`).

### B. Rollback Instructions
- The existing production deployment on **Vercel** remains active and untouched.
- If any regression occurs on Cloudflare, traffic can be redirected back to Vercel instantly without modifying code, database schema, or player profiles.

---

## 4. Edge Routing & CDN Caching Configuration

Edge routing is configured via [`public/_headers`](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/Vibe%20Arena%2024/memeverse/public/_headers) and [`public/_routes.json`](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/Vibe%20Arena%2024/memeverse/public/_routes.json):

1. **Bypassing Invocations (`_routes.json`)**:
   - All static paths (`/_next/static/*`, `/unity/*`, `/models/*`, `/audio/*`, `/brand/*`, `/draco/*`) are excluded from worker processing.
   - They are served directly from the Cloudflare CDN edge cache without consuming any of the 100,000 daily free worker requests.

2. **Cache-Control Policies (`_headers`)**:
   - **Static & Unity Assets**: `public, max-age=31536000, immutable` with Brotli compression (`Content-Encoding: br`).
   - **3D Models & Audio**: `public, max-age=2592000, stale-while-revalidate=86400`.
   - **Dynamic APIs & Player Profile**: `no-store, no-cache, must-revalidate, proxy-revalidate`. Caching of Firebase authentication tokens, user statistics, or dynamic sessions is strictly prohibited.

---

## 5. Security & Content Security Policy (CSP)

To prevent XSS and clickjacking while allowing full operation of Firebase Authentication (Google Sign-In), Three.js, and Unity WebGL, the following CSP is deployed at the edge:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://apis.google.com https://challenges.cloudflare.com https://www.gstatic.com; connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://challenges.cloudflare.com https://*.firebaseio.com wss://*.firebaseio.com https://apis.google.com; img-src 'self' data: blob: https://lh3.googleusercontent.com https://firebasestorage.googleapis.com https://challenges.cloudflare.com; frame-src 'self' https://accounts.google.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; media-src 'self' blob: data:; worker-src 'self' blob:;
```

---

## 6. Cloudflare R2 Storage Design

### Bucket Naming:
- `gullyverse-public-assets`

### Directory Layout:
```
gullyverse-public-assets/
├── games/
│   ├── thumbnails/       # 400x400 webp thumbnails
│   ├── covers/           # 1200x630 promotional banners
│   └── previews/         # Short MP4/WebM gameplay clips
├── branding/
│   ├── logos/            # SVG and vector brand assets
│   └── banners/          # Seasonal and promotional graphics
├── avatars/              # Default community avatar templates
└── public/               # Shared static binary assets
```

### CORS Policy for R2:
```json
[
  {
    "AllowedOrigins": [
      "https://gullyverse.com",
      "https://*.pages.dev",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
```

---

## 7. Turnstile Bot Protection Implementation

1. **Client Component**: [`TurnstileWidget.tsx`](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/Vibe%20Arena%2024/memeverse/src/components/common/TurnstileWidget.tsx) handles explicit non-intrusive challenge rendering.
2. **Server Verification**: [`turnstile.ts`](file:///c:/Users/sr24s/OneDrive/Documents/MY%20Projects/Vibe%20Arena%2024/memeverse/src/lib/security/turnstile.ts) queries `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
3. **Safety Guarantee**: Does not intercept or mutate Firebase Auth tokens or Google OAuth redirects. Operates in non-blocking passthrough mode if keys are not set.

---

## 8. Free Plan Cost Guardrails

- **Zero Paid Subscriptions**: No Workers Paid, No Cloudflare Images (paid tier), No Cloudflare Stream (paid tier), No Enterprise features.
- **R2 Free Tier**: 10 GB storage and 10,000,000 Class B read requests/month.
- **Workers/Pages Free Tier**: 100,000 requests/day. Offloaded via `_routes.json` so only dynamic requests hit the worker limit.
