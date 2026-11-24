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
              const dashboard = document.querySelector('.max-w-7xl');
              // find all elements in dashboard whose children are all smaller, but the element itself is >= 1000px
              const all = Array.from(dashboard.querySelectorAll('*'));
              const wideLeaves = all.filter(el => {
                const w = el.getBoundingClientRect().width;
                if (w < 800) return false;
                const children = Array.from(el.children);
                return children.length === 0 || children.every(c => c.getBoundingClientRect().width < 800);
              });
              wideLeaves.map(el => ({
                tag: el.tagName,
                classes: el.className,
                text: el.textContent?.slice(0, 30),
                width: el.getBoundingClientRect().width,
                scrollWidth: el.scrollWidth,
                computedWidth: window.getComputedStyle(el).width,
                computedMinWidth: window.getComputedStyle(el).minWidth
              }))
            `,
            returnByValue: true
          }
        }));
      };
      ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id === 1) {
          console.log('WIDE LEAVES:', JSON.stringify(parsed.result?.result?.value, null, 2));
          ws.close();
          chromeProc.kill();
        }
      };
    });
  });
}, 3000);
