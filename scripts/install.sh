#!/bin/bash
# OnyxBreach — setup script
# Safe. Read-only outside its own directory.

set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR"

echo "⛧ OnyxBreach setup"
echo "════════════════════"

# Check Python
if command -v python3 >/dev/null 2>&1; then
  echo "✓ python3 found: $(python3 --version)"
else
  echo "✗ python3 missing — install it with: sudo apt install python3"
fi

# Check C++ compiler
if command -v g++ >/dev/null 2>&1; then
  echo "✓ g++ found: $(g++ --version | head -1)"
  echo "  Compiling sysinfo.cpp..."
  g++ -O2 -o tools/sysinfo tools/sysinfo.cpp && echo "  ✓ tools/sysinfo built"
else
  echo "⚠ g++ not found — install with: sudo apt install g++"
fi

echo
echo "════════════════════"
echo "Ready. Start the server:"
echo "  cd backend && python3 server.py"
echo
echo "Then open: http://127.0.0.1:8080/"
echo
echo "════════════════════"
echo "⚠ This tool is a simulator. No files are read, no data is sent."
