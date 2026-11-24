import http from 'node:http';
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
              const vp = window.innerWidth;
              const all = Array.from(document.querySelectorAll('*'));
              const overflowers = all.filter(el => {
                const r = el.getBoundingClientRect();
                return r.right > vp + 10;
              }).map(el => ({
                tag: el.tagName,
                classes: el.className ? String(el.className).slice(0, 60) : '',
                right: el.getBoundingClientRect().right,
                width: el.getBoundingClientRect().width,
                text: el.textContent ? el.textContent.slice(0, 30).trim() : ''
              }));
              overflowers.slice(0, 15);
            `,
            returnByValue: true
          }
        }));
      };

      ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id === 1) {
          console.log('OVERFLOWERS:', JSON.stringify(parsed.result?.result?.value, null, 2));
          ws.close();
          chromeProc.kill();
        }
      };
    });
  });
}, 3000);
