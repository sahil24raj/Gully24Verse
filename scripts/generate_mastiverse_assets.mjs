import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const rootDir = path.resolve(import.meta.dirname, '..');
const brandDir = path.join(rootDir, 'public', 'brand');
const publicDir = path.join(rootDir, 'public');
const appDir = path.join(rootDir, 'src', 'app');

if (!fs.existsSync(brandDir)) {
  fs.mkdirSync(brandDir, { recursive: true });
}

// 1. MASTIVERSE M-Portal Symbol (Square 512x512 — matches Cover M-Portal)
const mPortalSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#14275C" />
      <stop offset="75%" stop-color="#080D1B" />
    </radialGradient>
    <linearGradient id="portalRim" x1="64" y1="64" x2="448" y2="448" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="50%" stop-color="#315CFF" />
      <stop offset="100%" stop-color="#2446D8" />
    </linearGradient>
    <linearGradient id="mLetter" x1="256" y1="120" x2="256" y2="390" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#BAE6FD" />
    </linearGradient>
    <filter id="portalGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <circle cx="256" cy="256" r="220" fill="#315CFF" opacity="0.16" filter="url(#portalGlow)" />

  <path d="M148 48 L364 48 L464 148 L464 364 L364 464 L148 464 L48 364 L48 148 Z"
        fill="url(#bgGrad)"
        stroke="url(#portalRim)"
        stroke-width="18"
        stroke-linejoin="round" />

  <path d="M168 88 L344 88 L424 168 L424 344 L344 424 L168 424 L88 344 L88 168 Z"
        fill="#0B1536"
        stroke="#60A5FA"
        stroke-opacity="0.45"
        stroke-width="6"
        stroke-linejoin="round" />

  <path d="M32 200 L32 312 M480 200 L480 312"
        stroke="#FF8A35"
        stroke-width="16"
        stroke-linecap="round" />

  <path d="M126 374 L126 144 L218 232 L218 308 L184 274 L184 374 Z"
        fill="url(#mLetter)"
        filter="url(#portalGlow)" />
  <path d="M386 374 L386 144 L294 232 L294 308 L328 274 L328 374 Z"
        fill="url(#mLetter)"
        filter="url(#portalGlow)" />
  <path d="M174 134 L256 218 L338 134 L338 194 L256 278 L174 194 Z"
        fill="#FFFFFF"
        filter="url(#portalGlow)" />
  <path d="M256 294 L276 322 L256 350 L236 322 Z"
        fill="#FF8A35" />
</svg>
`;

// 2. Full Horizontal Logo with MASTIVERSE Wordmark & Tagline (1200 x 360)
const horizontalSvg = `
<svg width="1200" height="360" viewBox="0 0 1200 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="hCore" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFA866" />
      <stop offset="50%" stop-color="#FF8A35" />
      <stop offset="100%" stop-color="#E05F05" />
    </radialGradient>
    <linearGradient id="hLeft" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#315CFF" />
      <stop offset="100%" stop-color="#1E3DBE" />
    </linearGradient>
    <linearGradient id="hRight" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#557BFF" />
      <stop offset="100%" stop-color="#315CFF" />
    </linearGradient>
    <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#F0F4FF" />
      <stop offset="100%" stop-color="#D9E4FF" />
    </linearGradient>
    <linearGradient id="verseGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#315CFF" />
      <stop offset="100%" stop-color="#FF8A35" />
    </linearGradient>
    <linearGradient id="taglineGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FF8A35" />
      <stop offset="100%" stop-color="#FFA866" />
    </linearGradient>
    <filter id="hGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Left: The M-Portal Icon (Scale: 280x280 at x=40, y=40) -->
  <g transform="translate(40, 40) scale(0.546875)">
    <!-- Hex Outer -->
    <path d="M256 32 L468 154 L468 358 L256 480 L44 358 L44 154 Z" fill="#080D1B" stroke="#315CFF" stroke-width="6" />
    <!-- Floating Crown -->
    <path d="M256 86 L284 128 L256 150 L228 128 Z" fill="#FF8A35" filter="url(#hGlow)" />
    <!-- M Wings -->
    <path d="M100 380 L100 162 L188 94 L256 244 L256 304 L176 178 L148 200 L148 380 Z" fill="url(#hLeft)" stroke="#4C73FF" stroke-width="3" />
    <path d="M412 380 L412 162 L324 94 L256 244 L256 304 L336 178 L364 200 L364 380 Z" fill="url(#hRight)" stroke="#6E90FF" stroke-width="3" />
    <!-- Saffron Core -->
    <circle cx="256" cy="336" r="42" fill="url(#hCore)" filter="url(#hGlow)" />
    <path d="M256 296 L264 328 L296 336 L264 344 L256 376 L248 344 L216 336 L248 328 Z" fill="#FFFFFF" />
  </g>

  <!-- Right: Typography -->
  <!-- Main Brand Title: MASTIVERSE -->
  <text x="350" y="195" font-family="'Space Grotesk', 'Russo One', sans-serif" font-size="112" font-weight="900" letter-spacing="4" fill="url(#textGrad)">
    MASTI<tspan fill="url(#verseGrad)">VERSE</tspan>
  </text>

  <!-- Tagline Badge -->
  <g transform="translate(355, 230)">
    <rect x="0" y="0" width="460" height="42" rx="21" fill="#101A33" stroke="#315CFF" stroke-width="2" stroke-opacity="0.6" />
    <circle cx="24" cy="21" r="5" fill="#FF8A35" />
    <text x="42" y="27" font-family="'Space Grotesk', sans-serif" font-size="19" font-weight="800" letter-spacing="6" fill="#FFFFFF" text-transform="uppercase">
      APNA GAME. <tspan fill="url(#taglineGrad)">APNI DUNIYA.</tspan>
    </text>
  </g>

  <!-- Desi Gaming Ecosystem Accent Pill -->
  <g transform="translate(835, 230)">
    <rect x="0" y="0" width="280" height="42" rx="21" fill="rgba(49, 92, 255, 0.12)" stroke="rgba(255, 138, 53, 0.4)" stroke-width="1.5" />
    <text x="140" y="26" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" letter-spacing="3" fill="#FF8A35">
      ESTD 2026 // BHARAT
    </text>
  </g>
</svg>
`;

async function generateAll() {
  console.log('⚡ Generating Mastiverse Vector & Raster Assets...');

  // Save SVGs
  fs.writeFileSync(path.join(brandDir, 'mastiverse-icon.svg'), mPortalSvg.trim());
  fs.writeFileSync(path.join(brandDir, 'mastiverse-logo.svg'), horizontalSvg.trim());
  console.log('✓ SVGs written');

  // Generate PNGs using Sharp
  const iconBuffer = Buffer.from(mPortalSvg);
  const logoBuffer = Buffer.from(horizontalSvg);

  // 1. mastiverse-icon.png (512x512)
  await sharp(iconBuffer)
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(brandDir, 'mastiverse-icon.png'));

  // 2. mastiverse-badge-logo.png (512x512)
  await sharp(iconBuffer)
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(brandDir, 'mastiverse-badge-logo.png'));

  // 3. mastiverse-logo.png (1200x360)
  await sharp(logoBuffer)
    .resize(1200, 360)
    .png({ quality: 100 })
    .toFile(path.join(brandDir, 'mastiverse-logo.png'));

  // 4. mastiverse-horizontal.png (800x240)
  await sharp(logoBuffer)
    .resize(800, 240)
    .png({ quality: 100 })
    .toFile(path.join(brandDir, 'mastiverse-horizontal.png'));

  // 5. Favicons and Apple Touch Icons (512, 192, 180, 64, 32)
  await sharp(iconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon.png'));

  await sharp(iconBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-icon.png'));

  await sharp(iconBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(appDir, 'icon.png'));

  await sharp(iconBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));

  // Favicon 64x64 as png and ico fallback
  await sharp(iconBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  await sharp(iconBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(appDir, 'favicon.ico'));

  console.log('✅ All Mastiverse visual brand assets successfully generated!');
}

generateAll().catch(err => {
  console.error('Asset Generation Error:', err);
  process.exit(1);
});
