// ============================================================
// ONYXBREACH — FRONTEND ENGINE
// Multi-file breach simulator. 100% SAFE. Zero real attacks.
// ============================================================

// ---- Boot sequence ----
const boot = document.getElementById('boot');
const bootLines = [
  { t:'<span class="g">[    0.000000]</span> Loading onyx-kernel v6.12.1...', d:40 },
  { t:'<span class="g">[    0.000142]</span> Initializing network stack... OK', d:60 },
  { t:'<span class="i">[    0.000320]</span> Probing target environment...', d:150 },
  { t:'<span class="d">[    0.000511]</span> ⚠ BYPASSING VERIFIED BOOT...', d:250 },
  { t:'<span class="d">[    0.000722]</span> ⚠ BYPASSING TPM ATTESTATION...', d:350 },
  { t:'<span class="i">[    0.000911]</span> Establishing covert tunnel...', d:200 },
  { t:'<span class="g">[    0.001100]</span> Encrypted channel active.', d:200 },
  { t:'<span class="d">[    0.001320]</span> ▶▶ ROOT ACCESS ACQUIRED ◀◀', d:500 },
  { t:'', d:200 },
  { t:'<span class="b">▸ Launching breach console...</span>', d:600 },
];
let bi = 0;
function bootNext() {
  if (bi >= bootLines.length) {
    boot.style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    init();
    return;
  }
  const line = bootLines[bi];
  boot.innerHTML += line.t + '\n';
  bi++;
  setTimeout(bootNext, line.d);
}
setTimeout(bootNext, 300);

// ---- Clock ----
function tick() {
  const n = new Date();
  document.getElementById('clock').textContent =
    [n.getHours(), n.getMinutes(), n.getSeconds()]
      .map(x => String(x).padStart(2,'0')).join(':');
}
setInterval(tick, 1000); tick();

// ---- Helpers ----
function log(id, msg, cls='') {
  const el = document.getElementById(id);
  if (!el) return;
  const d = document.createElement('div');
  d.className = cls;
  d.innerHTML = msg;
  el.appendChild(d);
  el.scrollTop = el.scrollHeight;
}
function fill(id, pct, red=false) {
  const f = document.getElementById(id);
  if (!f) return;
  f.style.width = pct + '%';
}

// ============================================================
// INIT — real fingerprint + real IP + geo
// ============================================================
async function init() {
  // ---- Real browser fingerprint ----
  const c = document.createElement('canvas');
  c.width = 240; c.height = 60;
  const ctx = c.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '16px Arial';
  ctx.fillStyle = '#f60'; ctx.fillRect(125,1,62,20);
  ctx.fillStyle = '#069'; ctx.fillText('Onyx, 🐟🎁', 2, 15);
  const fp = c.toDataURL();
  const hash = Array.from(fp).reduce((h,ch) => ((h<<5)-h+ch.charCodeAt(0))|0, 0);
  const fpHash = Math.abs(hash).toString(16).padStart(8,'0');

  // ---- Real IP + geo ----
  let ip = '?', city = '?', country = '?', isp = '?';
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    ip = (await r.json()).ip;
    const g = await fetch('https://ipwho.is/' + ip);
    const geo = await g.json();
    if (geo.success) {
      city = geo.city; country = geo.country; isp = geo.connection?.isp || '?';
    }
  } catch(e) {}

  document.getElementById('tIP').textContent = 'IP: ' + ip;
  document.getElementById('tLoc').textContent = 'LOC: ' + city;

  // ---- Real screen / device info ----
  const info = [
    ['Public IP', ip, 'hot'],
    ['Location', `${city}, ${country}`, ''],
    ['ISP', isp, ''],
    ['User Agent', navigator.userAgent.slice(0, 50) + '...', ''],
    ['Platform', navigator.platform, ''],
    ['Screen', `${screen.width}×${screen.height}`, ''],
    ['CPU Cores', navigator.hardwareConcurrency || '?', ''],
    ['Memory', (navigator.deviceMemory || '?') + ' GB', ''],
    ['Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone, ''],
    ['Canvas Hash', fpHash, 'hot'],
    ['GPU', getGPU(), ''],
    ['Fingerprint', 'DEV-' + fpHash.toUpperCase(), 'ok'],
  ];
  document.getElementById('targetInfo').innerHTML = info
    .map(([k,v,cls]) => `<div class="row"><span class="k">${k}</span><span class="v ${cls}">${v}</span></div>`)
    .join('');
}

function getGPU() {
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    return dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL).slice(0,40) : 'unavailable';
  } catch(e) { return 'unavailable'; }
}

// ============================================================
// BREACH SEQUENCE
// ============================================================
let running = false;
document.getElementById('startBtn').addEventListener('click', startBreach);

async function startBreach() {
  if (running) return;
  running = true;
  document.getElementById('startBtn').disabled = true;

  // ---- Signal hijack ----
  log('sigLog', '▸ Scanning wireless environment...', 'info');
  const signals = ['FBI_Surveillance_Van_4','PrettyFlyForAWiFi','MomUseThisOne','DropItLikeItsHotspot','LAN_Solo','TellMyWiFiLoveHer','Virus.exe','GetYourOwnWiFi'];
  for (let i = 0; i < signals.length; i++) {
    await sleep(200);
    fill('sigFill', ((i+1)/signals.length)*100);
    log('sigLog', `  ↳ ${signals[i]} <span class="ok">HANDSHAKE CAPTURED</span>`, 'ok');
  }
  log('sigLog', '▸ Signal hijack complete.', 'warn');

  // ---- File exfil (FAKE NAMES ONLY) ----
  const files = [
    'homework_final_FINAL_v3.docx','passwords.txt','project_notes.md',
    'essay_draft.pdf','screenshot_2026.png','bookmarks.json','grades.xlsx',
    'history.db','search_queries.log','chats_backup.zip','private/IMG_4821.jpg',
    'private/IMG_4822.jpg','notes_for_school.txt','school_id_scan.pdf',
    'internet_history.db','downloads/cool_game_setup.exe','documents/secret_diary.docx',
    '.ssh/id_rsa','.ssh/known_hosts','cookies.sqlite','saved_passwords.csv',
    'autofill_data.json','clipboard_history.txt','recent_files.log',
    'contacts.vcf','messages_backup.db','tabs_sessions.json',
  ];
  log('exLog', '', 'dim');
  let bytes = 0;
  for (let i = 0; i < files.length; i++) {
    await sleep(180);
    const name = files[i];
    const kb = Math.random()*900+100;
    bytes += kb;
    fill('exFill', ((i+1)/files.length)*100, true);
    const f = document.createElement('div');
    f.className = 'file';
    f.innerHTML = `<span>📄 ${name}</span><span class="sz">${kb.toFixed(1)} KB</span>`;
    document.getElementById('exFiles').appendChild(f);
    document.getElementById('exFiles').scrollTop = 99999;
    document.getElementById('exCount').textContent = i+1;
    document.getElementById('exSize').textContent = (bytes/1024).toFixed(2) + ' MB';
  }
  log('exLog', '▸ Exfil simulation complete. 0 real files touched.', 'warn');

  // ---- Crypto crack (simulated) ----
  const target = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  document.getElementById('crackHash').textContent = target.slice(0,48) + '...';
  const words = ['password','123456','qwerty','admin','letmein','welcome','dragon','monkey'];
  for (let i = 0; i < 40; i++) {
    await sleep(100);
    fill('crFill', ((i+1)/40)*100, true);
    if (i % 5 === 0) {
      log('crLog', `  trying: ${words[(i/5)%words.length]}...`, 'dim');
    }
  }
  log('crLog', '▸ Crack simulation ended. No real cracking performed.', 'warn');

  // ---- Screen capture (REAL API, needs permission) ----
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({video:true});
    const v = document.getElementById('capVideo');
    v.srcObject = stream;
    document.getElementById('snapBtn').disabled = false;
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      v.srcObject = null;
      document.getElementById('snapBtn').disabled = true;
    });
  } catch(e) {
    log('sigLog', '⚠ Screen capture declined — that\'s fine.', 'warn');
  }

  document.getElementById('endBtn').disabled = false;
  running = false;
}

document.getElementById('snapBtn').addEventListener('click', () => {
  const v = document.getElementById('capVideo');
  if (!v.srcObject) return;
  const c = document.createElement('canvas');
  c.width = v.videoWidth || 640;
  c.height = v.videoHeight || 360;
  c.getContext('2d').drawImage(v, 0, 0);
  const img = document.createElement('img');
  img.src = c.toDataURL('image/png');
  document.getElementById('capSnaps').appendChild(img);
});

document.getElementById('endBtn').addEventListener('click', reveal);

function reveal() {
  // Stop any capture
  const v = document.getElementById('capVideo');
  if (v.srcObject) v.srcObject.getTracks().forEach(t => t.stop());

  document.getElementById('app').style.display = 'none';
  document.getElementById('reveal').style.display = 'flex';

  console.log('%c( )0KE F#0M 0n9x$o^l', 'color:#00ffcc;font-size:20px;font-weight:bold;text-shadow:0 0 20px #00ffcc;');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---- Auto reveal after all done (if user forgets to click) ----
setTimeout(() => {
  const endBtn = document.getElementById('endBtn');
  if (endBtn && !endBtn.disabled) {
    // keep it available, don't force
  }
}, 60000);
