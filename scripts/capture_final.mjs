import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-sandbox',
  '--disable-gpu',
  '--window-size=404,900',
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
        // Scroll slightly down to bring the Command Center & Passport directly into focus
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `window.scrollTo(0, 100);`
          }
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'png' } }));
        }, 1200);
      };

      ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id === 2 && parsed.result?.data) {
          fs.writeFileSync('C:\\Users\\sr24s\\.gemini\\antigravity\\brain\\fd95d42c-6a65-4939-a3fa-9491565e3816\\final_responsive_check_404.png', Buffer.from(parsed.result.data, 'base64'));
          console.log('404 SCREENSHOT SAVED!');
          ws.close();
          chromeProc.kill();
        }
      };
    });
  });
}, 3000);
