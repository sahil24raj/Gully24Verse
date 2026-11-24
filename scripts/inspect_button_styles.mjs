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
              if (!btn) ({ error: 'no btn' });
              else {
                const cs = window.getComputedStyle(btn);
                const span = btn.querySelector('span');
                const spanCs = span ? window.getComputedStyle(span) : {};
                const svg = btn.querySelector('svg');
                const svgRect = svg ? svg.getBoundingClientRect() : {};
                const spanRect = span ? span.getBoundingClientRect() : {};
                const btnRect = btn.getBoundingClientRect();
                ({
                  fontFamily: cs.fontFamily,
                  fontSize: cs.fontSize,
                  lineHeight: cs.lineHeight,
                  color: cs.color,
                  btnRect: { x: btnRect.x, y: btnRect.y, w: btnRect.width, h: btnRect.height },
                  spanRect: { x: spanRect.x, y: spanRect.y, w: spanRect.width, h: spanRect.height },
                  svgRect: { x: svgRect.x, y: svgRect.y, w: svgRect.width, h: svgRect.height },
                  spanFontFamily: spanCs.fontFamily,
                  spanColor: spanCs.color
                })
              }
            `,
            returnByValue: true
          }
        }));
      };
      ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id === 1) {
          console.log('BTN DETAILS:', JSON.stringify(parsed.result?.result?.value, null, 2));
          ws.close();
          chromeProc.kill();
        }
      };
    });
  });
}, 3000);
