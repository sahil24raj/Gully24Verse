import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-sandbox',
  '--disable-gpu',
  '--window-size=404,800',
  'https://gullyverse.pages.dev/dashboard'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const targets = JSON.parse(data);
      const page = targets.find(t => t.type === 'page' && t.url.includes('dashboard'));
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              const btns = Array.from(document.querySelectorAll('button, a'));
              const squadBtn = btns.find(b => b.textContent.includes('CREATE SQUAD'));
              const lbBtn = btns.find(b => b.textContent.includes('GLOBAL LEADERBOARD'));
              const editBtn = btns.find(b => b.textContent.includes('EDIT PROFILE'));
              const getDetails = (el) => {
                if (!el) return null;
                const r = el.getBoundingClientRect();
                const span = el.querySelector('span');
                const sr = span ? span.getBoundingClientRect() : null;
                return {
                  text: el.textContent,
                  box: { x: r.x, y: r.y, w: r.width, h: r.height },
                  spanBox: sr ? { x: sr.x, y: sr.y, w: sr.width, h: sr.height } : null
                };
              };
              ({
                squadBtn: getDetails(squadBtn),
                lbBtn: getDetails(lbBtn),
                editBtn: getDetails(editBtn),
                bodyScrollWidth: document.body.scrollWidth,
                docWidth: document.documentElement.clientWidth
              })
            `,
            returnByValue: true
          }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'png' } }));
        }, 1500);
      };

      ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id === 1) {
          console.log('VERIFIED DIMENSIONS:', JSON.stringify(parsed.result?.result?.value, null, 2));
        }
        if (parsed.id === 2 && parsed.result?.data) {
          fs.writeFileSync('C:\\Users\\sr24s\\.gemini\\antigravity\\brain\\fd95d42c-6a65-4939-a3fa-9491565e3816\\verified_responsive_dashboard.png', Buffer.from(parsed.result.data, 'base64'));
          console.log('NEW SCREENSHOT CAPTURED!');
          ws.close();
          chromeProc.kill();
        }
      };
    });
  });
}, 3000);
