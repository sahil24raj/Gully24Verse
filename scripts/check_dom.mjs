import http from 'node:http';
import { spawn } from 'node:child_process';

const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-sandbox',
  '--disable-gpu',
  'https://gullyverse.pages.dev/dashboard'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const targets = JSON.parse(data);
      const page = targets.find(t => t.type === 'page' && t.url.includes('dashboard'));
      if (!page) {
        console.log('No dashboard page target');
        chromeProc.kill();
        return;
      }
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              Array.from(document.querySelectorAll('button, a[href*="leaderboard"]')).map(el => ({
                tag: el.tagName,
                text: el.innerText.trim(),
                classes: el.className,
                rect: el.getBoundingClientRect()
              }))
            `,
            returnByValue: true
          }
        }));
      };
      ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id === 1) {
          console.log('BUTTONS & LINKS:', JSON.stringify(parsed.result?.result?.value, null, 2));
          ws.close();
          chromeProc.kill();
        }
      };
    });
  });
}, 3000);
