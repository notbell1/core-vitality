"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarProvider = void 0;
class SidebarProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }
    updateStats(data) {
        if (this._view) {
            this._view.webview.postMessage({ type: "update", data });
        }
    }
    _getHtmlForWebview(webview) {
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          :root {
            --h-color: #ff4757; --e-color: #ffa502; --p-color: #2ed573;
            --accent: #00d2d3;
          }

          body { 
            font-family: 'Segoe UI', sans-serif; color: #ffffff; padding: 15px; margin: 0;
            background: linear-gradient(125deg, #05050a, #1a1a2e, #05050a, #0f0c29);
            background-size: 400% 400%;
            animation: nebula 15s ease infinite;
            height: 100vh; overflow-x: hidden;
          }

          @keyframes nebula { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

          .top-meta {
            display: flex; justify-content: space-between; padding: 10px;
            background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 8px;
            border: 1px solid rgba(255,255,255,0.1); font-size: 9px; backdrop-filter: blur(5px);
          }

          /* Project & Time Detail */
          .project-info {
            background: rgba(0,0,0,0.2); border-radius: 12px; padding: 10px;
            margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05);
            text-align: center;
          }
          .project-name { font-size: 12px; font-weight: 800; color: var(--accent); display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
          .live-clock { font-size: 18px; font-weight: 200; font-family: monospace; letter-spacing: 2px; }
          .live-date { font-size: 9px; opacity: 0.5; text-transform: uppercase; margin-top: 2px; }

          .luxury-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 28px;
            padding: 25px; text-align: center; backdrop-filter: blur(30px);
            box-shadow: 0 25px 50px rgba(0,0,0,0.5); margin-bottom: 20px;
            position: relative;
          }

          .char-wrapper { 
            position: relative; width: 110px; height: 110px; margin: 0 auto 20px; 
            animation: floating 3s ease-in-out infinite;
          }
          
          #character-svg { width: 100%; height: 100%; z-index: 2; position: relative; }
          .breathing { animation: breath 4s ease-in-out infinite; transform-origin: center; }
          @keyframes floating { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes breath { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

          .aura {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 90px; height: 90px; border-radius: 50%;
            filter: blur(30px); opacity: 0.5; z-index: 1; transition: all 0.8s ease;
          }

          .bar-group { margin-bottom: 12px; text-align: left; }
          .bar-label { display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 5px; font-weight: bold; }
          .bar-track { height: 6px; background: rgba(0,0,0,0.3); border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); }
          .bar-fill { height: 100%; border-radius: 10px; transition: width 1s ease; box-shadow: 0 0 15px var(--glow); }

          .incident-box {
            background: rgba(0, 0, 0, 0.25); border-radius: 18px; padding: 15px;
            border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(10px);
          }
          .error-node {
            background: rgba(255, 71, 87, 0.05); border-radius: 10px; padding: 10px;
            margin-bottom: 8px; border-left: 3px solid var(--h-color);
          }
          .err-msg { font-size: 11px; color: #fff; }
          .err-meta { font-size: 9px; opacity: 0.4; margin-top: 4px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="top-meta">
          <span>CORE <span style="color:var(--accent)">VITALITY</span></span>
          <span style="opacity:0.5">BY: ZXMARCHIA</span>
        </div>

        <div class="project-info">
            <span class="project-name" id="p-name">LOADING PROJECT...</span>
            <div class="live-clock" id="clock">00:00:00</div>
            <div class="live-date" id="date">DAY, 01 MONTH 2026</div>
        </div>

        <div class="luxury-card">
          <div class="char-wrapper">
            <div id="aura" class="aura"></div>
            <svg id="character-svg" viewBox="0 0 100 100" class="breathing">
              <circle id="char-body" cx="50" cy="50" r="45" fill="#2f3542" transition="all 0.5s"/>
              <g id="eyes">
                <circle cx="35" cy="45" r="5" fill="white" />
                <circle cx="65" cy="45" r="5" fill="white" />
              </g>
              <path id="mouth" d="M 35 65 Q 50 75 65 65" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" />
            </svg>
          </div>

          <div class="bar-group">
            <div class="bar-label"><span>HEALTH</span><span id="h-txt">100%</span></div>
            <div class="bar-track"><div id="h-bar" class="bar-fill" style="background:var(--h-color);--glow:var(--h-color)"></div></div>
          </div>
          <div class="bar-group">
            <div class="bar-label"><span>ENERGY</span><span id="e-txt">100%</span></div>
            <div class="bar-track"><div id="e-bar" class="bar-fill" style="background:var(--e-color);--glow:var(--e-color)"></div></div>
          </div>
          <div class="bar-group">
            <div class="bar-label"><span>HAPPINESS</span><span id="p-txt">100%</span></div>
            <div class="bar-track"><div id="p-bar" class="bar-fill" style="background:var(--p-color);--glow:var(--p-color)"></div></div>
          </div>
        </div>

        <div class="incident-box">
          <span style="font-size: 10px; font-weight: 800; color: var(--accent); display: block; margin-bottom: 12px;">REALTIME LOGS</span>
          <div id="error-list"></div>
        </div>

        <script>
          const vscode = acquireVsCodeApi();
          const clockEl = document.getElementById('clock');
          const dateEl = document.getElementById('date');

          // Fungsi Update Waktu Realtime berdasarkan Lokal User
          function updateClock() {
            const now = new Date();
            // Jam
            clockEl.innerText = now.toLocaleTimeString([], { hour12: false });
            // Tanggal (Contoh: SATURDAY, 07 MARCH 2026)
            dateEl.innerText = now.toLocaleDateString(undefined, { 
                weekday: 'long', 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
            }).toUpperCase();
          }
          setInterval(updateClock, 1000);
          updateClock();

          window.addEventListener('message', event => {
            const { data } = event.data;
            
            // Update Project Name
            document.getElementById('p-name').innerText = data.projectName;

            // Sync Bars
            const sync = (id, v) => {
              document.getElementById(id + '-bar').style.width = v + '%';
              document.getElementById(id + '-txt').innerText = Math.round(v) + '%';
            };
            sync('h', data.health); sync('e', data.energy); sync('p', data.happiness);

            // 5 STAGES EVOLUTION Logic
            const aura = document.getElementById('aura');
            const body = document.getElementById('char-body');
            const mouth = document.getElementById('mouth');
            const eyes = document.getElementById('eyes');

            if (data.health <= 30) {
              body.setAttribute('fill', '#2c3e50'); aura.style.background = '#8e44ad';
              mouth.setAttribute('d', 'M 35 70 L 65 70');
              eyes.innerHTML = '<path d="M32 42 L38 48 M32 48 L38 42" stroke="white" stroke-width="3"/><path d="M62 42 L68 48 M62 48 L68 42" stroke="white" stroke-width="3"/>';
            } else if (data.errors.length > 2 || data.health <= 60) {
              body.setAttribute('fill', '#eb4d4b'); aura.style.background = '#ff4757';
              mouth.setAttribute('d', 'M 40 75 Q 50 60 60 75');
              eyes.innerHTML = '<circle cx="35" cy="45" r="7" fill="white"/><circle cx="65" cy="45" r="7" fill="white"/>';
            } else if (data.energy <= 40) {
              body.setAttribute('fill', '#f0932b'); aura.style.background = '#ffa502';
              mouth.setAttribute('d', 'M 35 68 L 65 68');
              eyes.innerHTML = '<path d="M30 45 L40 45 M60 45 L70 45" stroke="white" stroke-width="4"/>';
            } else if (data.health >= 95 && data.energy >= 95) {
              body.setAttribute('fill', '#22a6b3'); aura.style.background = '#00d2d3';
              mouth.setAttribute('d', 'M 30 60 Q 50 85 70 60');
              eyes.innerHTML = '<path d="M30 40 Q35 30 40 40 M60 40 Q65 30 70 40" stroke="white" stroke-width="3" fill="none"/>';
            } else {
              body.setAttribute('fill', '#4834d4'); aura.style.background = '#686de0';
              mouth.setAttribute('d', 'M 35 65 Q 50 75 65 65');
              eyes.innerHTML = '<circle cx="35" cy="45" r="5" fill="white"/><circle cx="65" cy="45" r="5" fill="white"/>';
            }

            const list = document.getElementById('error-list');
            list.innerHTML = data.errors.length === 0 ? 
              '<div style="font-size: 10px; opacity: 0.2; text-align: center; padding: 10px;">SYSTEM NORMAL</div>' :
              data.errors.map(err => \`
                <div class="error-node">
                  <span class="err-msg">\${err.message}</span>
                  <div class="err-meta">LOC: \${err.file} | LINE: \${err.line + 1}</div>
                </div>
              \`).join('');
          });
        </script>
      </body>
      </html>`;
    }
}
exports.SidebarProvider = SidebarProvider;
//# sourceMappingURL=SidebarProvider.js.map