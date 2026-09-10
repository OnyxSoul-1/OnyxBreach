# ⛧ ONYXBREACH

**A multi-language breach simulator. Looks terrifying. Harmless.**

## What it is
A prank / educational framework that shows what a real breach looks like —
using **real browser APIs, real IP geolocation, real fingerprinting** —
but never touches a single real file, never sends data anywhere,
and reveals a joke at the end.

## Files

| File | Language | Purpose |
|------|----------|---------|
| `frontend/index.html` | HTML | UI |
| `frontend/style.css` | CSS | Terminal aesthetic |
| `frontend/breach.js` | JavaScript | Breach sequence + real APIs |
| `backend/server.py` | Python | Local HTTP server |
| `tools/sysinfo.cpp` | C++ | Real system inventory tool |
| `scripts/install.sh` | Bash | Setup |

## Run it

```bash
bash scripts/install.sh
cd backend && python3 server.py
