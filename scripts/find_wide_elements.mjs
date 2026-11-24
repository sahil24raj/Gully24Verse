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
              const all = Array.from(document.querySelectorAll('*'));
              const wide = all.filter(el => {
                const r = el.getBoundingClientRect();
                return r.width > 500 && (!el.children.length || Array.from(el.children).every(c => c.getBoundingClientRect().width <= 500));
              });
              // Leaf or near-leaf elements causing wide width
              wide.map(el => ({
                tag: el.tagName,
                id: el.id,
                classes: el.className,
                rect: el.getBoundingClientRect(),
                text: el.textContent?.slice(0, 40)
              }))
            `,
            returnByValue: true
          }
        }));
      };
      ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id === 1) {
          console.log('WIDE ELEMENTS:', JSON.stringify(parsed.result?.result?.value, null, 2));
          ws.close();
          chromeProc.kill();
        }
      };
    });
  });
}, 3000);
