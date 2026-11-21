import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');
const nextStaticDir = path.join(projectRoot, '.next', 'static');
const nextServerAppDir = path.join(projectRoot, '.next', 'server', 'app');
const distDir = path.join(projectRoot, 'cloudflare-dist');

console.log('🚀 Preparing Cloudflare Pages production distribution...');

// Clean distDir
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Helper to copy recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy public assets (excluding the placeholder public/index.html if present)
console.log('📦 Copying public assets...');
copyDirSync(publicDir, distDir);

// 2. Copy .next/static to cloudflare-dist/_next/static
console.log('📦 Copying Next.js static chunks & styles...');
const targetStaticDir = path.join(distDir, '_next', 'static');
copyDirSync(nextStaticDir, targetStaticDir);

// 3. Process .next/server/app for HTML and RSC files
console.log('📦 Assembling HTML & RSC routes...');

function scanAndCopyRoutes(currentDir, relativePrefix = '') {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relPath = path.join(relativePrefix, entry.name);

    if (entry.isDirectory()) {
      if (!entry.name.endsWith('.segments')) {
        scanAndCopyRoutes(fullPath, relPath);
      }
    } else if (entry.name.endsWith('.html')) {
      const routeName = entry.name.replace('.html', '');
      let htmlContent = fs.readFileSync(fullPath, 'utf-8');
      
      // Clean any residual Next.js dynamic image URLs to direct static asset paths
      htmlContent = htmlContent.replace(/\/_next\/image\?url=(?:%2F|\/)([^&"'>\s]+)&(?:amp;)?w=\d+&(?:amp;)?q=\d+/g, '/$1');
      
      if (routeName === 'index') {
        fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent, 'utf-8');
      } else if (routeName === '_not-found') {
        fs.writeFileSync(path.join(distDir, '404.html'), htmlContent, 'utf-8');
        fs.writeFileSync(path.join(distDir, '_not-found.html'), htmlContent, 'utf-8');
      } else {
        // e.g. about.html -> dist/about.html AND dist/about/index.html
        const routeDir = path.join(distDir, relativePrefix, routeName);
        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(path.join(distDir, relativePrefix, entry.name), htmlContent, 'utf-8');
        fs.writeFileSync(path.join(routeDir, 'index.html'), htmlContent, 'utf-8');
      }
    } else if (entry.name.endsWith('.rsc')) {
      const targetRscDir = path.join(distDir, relativePrefix);
      fs.mkdirSync(targetRscDir, { recursive: true });
      fs.copyFileSync(fullPath, path.join(targetRscDir, entry.name));
    }
  }
}

scanAndCopyRoutes(nextServerAppDir);

// 4. Ensure _headers, _redirects and _routes.json exist in dist
const headersSrc = path.join(publicDir, '_headers');
if (fs.existsSync(headersSrc)) {
  fs.copyFileSync(headersSrc, path.join(distDir, '_headers'));
}
const redirectsSrc = path.join(publicDir, '_redirects');
if (fs.existsSync(redirectsSrc)) {
  fs.copyFileSync(redirectsSrc, path.join(distDir, '_redirects'));
}

console.log('✅ Cloudflare Pages distribution ready in memeverse/cloudflare-dist!');
