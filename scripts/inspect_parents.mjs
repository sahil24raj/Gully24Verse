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
              const btn = document.querySelector('button.font-display');
              let cur = btn;
              const chain = [];
              while (cur) {
                const r = cur.getBoundingClientRect();
                chain.push({
                  tag: cur.tagName,
                  id: cur.id,
                  classes: cur.className,
                  rect: { x: r.x, y: r.y, w: r.width, h: r.height },
                  scrollWidth: cur.scrollWidth,
                  clientWidth: cur.clientWidth
                });
                cur = cur.parentElement;
              }
              chain;
            `,
            returnByValue: true
          }
        }));
      };
      ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id === 1) {
          console.log('PARENT CHAIN:', JSON.stringify(parsed.result?.result?.value, null, 2));
          ws.close();
          chromeProc.kill();
        }
      };
    });
  });
}, 3000);
