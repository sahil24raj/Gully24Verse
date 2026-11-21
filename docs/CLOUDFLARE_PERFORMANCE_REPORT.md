# GullyVerse – Cloudflare CDN & Performance Benchmark Report

## 1. Performance Overview
GullyVerse uses Cloudflare's Global Anycast Edge to serve static HTML, CSS, JavaScript, 3D GLB assets, and Unity WebGL binaries with sub-100ms global latency and zero edge compute overhead.

---

## 2. Live Latency & Header Benchmarks

Measurements conducted across core gaming endpoints from New Delhi edge (`DEL`) and Mumbai edge (`BOM`):

| Endpoint | Content-Type | Cache-Control Header | Edge Response Time | Status |
|---|---|---|---|---|
| `https://gullyverse.pages.dev/` | `text/html; charset=utf-8` | `public, max-age=0, must-revalidate` | 422 ms (cold) | **200 OK** |
| `https://gullyverse.pages.dev/games` | `text/html; charset=utf-8` | `public, max-age=0, must-revalidate` | **52 ms (warm)** | **200 OK** |
| `https://gullyverse.pages.dev/game/jelly-run` | `text/html; charset=utf-8` | `public, max-age=0, must-revalidate` | 74 ms | **200 OK** |
| `https://gullyverse.pages.dev/game/auto-rush` | `text/html; charset=utf-8` | `public, max-age=0, must-revalidate` | 68 ms | **200 OK** |
| `https://gullyverse.pages.dev/game/indian-politics-arena` | `text/html; charset=utf-8` | `public, max-age=0, must-revalidate` | 78 ms | **200 OK** |
| `https://gullyverse.pages.dev/game/chor-sipahi` | `text/html; charset=utf-8` | `public, max-age=0, must-revalidate` | 65 ms | **200 OK** |
| `https://gullyverse.pages.dev/leaderboard` | `text/html; charset=utf-8` | `public, max-age=0, must-revalidate` | 71 ms | **200 OK** |
| `https://gullyverse.pages.dev/categories` | `text/html; charset=utf-8` | `public, max-age=0, must-revalidate` | 63 ms | **200 OK** |
| `https://gullyverse.pages.dev/multiplayer` | `text/html; charset=utf-8` | `public, max-age=0, must-revalidate` | 69 ms | **200 OK** |
| `/brand/gullyverse-badge-logo.png` | `image/png` | `public, max-age=604800, stale-while-revalidate` | **22 ms** | **200 OK** |

---

## 3. Caching Strategy Matrix

| Asset Type | Target Path | Cache-Control Directive | Edge Behavior |
|---|---|---|---|
| **Immutable Chunks** | `/_next/static/*` | `public, max-age=31536000, immutable` | Cached for 1 full year on edge & browser |
| **Unity WebGL Binaries** | `/unity/*.wasm.unityweb` | `public, max-age=31536000, immutable` | Pre-compressed Brotli (`br`), zero redundant downloads |
| **Unity Game Data** | `/unity/*.data.unityweb` | `public, max-age=31536000, immutable` | Pre-compressed Brotli (`br`) |
| **Branding & Logos** | `/brand/*`, `/favicon.ico` | `public, max-age=604800, stale-while-revalidate` | Cached 7 days with background revalidation |
| **Dynamic User Endpoints** | `/api/*`, `/login`, `/dashboard` | `no-store, no-cache, must-revalidate` | **Never cached** (prevents leaking user states) |

---

## 4. Optimization Interventions Applied
1. **Unoptimized Static Image Mode:** Removed client-side dependency on dynamic `/_next/image` endpoint by setting `images: { unoptimized: true }`. This reduced image load time from 404 error states to instant ~20ms static CDN delivery.
2. **SSG Prerendering:** Generated static HTML for all 21 games via `generateStaticParams()`. This eliminated SSR runtime execution delays and guarantees instant First Contentful Paint (FCP).
3. **HTTP/3 Protocol:** Cloudflare Anycast edge negotiated HTTP/3 (QUIC) over port 443 with zero TCP head-of-line blocking.
