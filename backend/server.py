#!/usr/bin/env python3
"""
OnyxBreach — Backend Server
Serves the frontend and exposes a harmless /sysinfo endpoint.
Runs locally. Binds to 127.0.0.1 only. Nothing leaves your machine.
"""

import json
import platform
import socket
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

PORT = 8080
FRONTEND = Path(__file__).parent.parent / "frontend"

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND), **kwargs)

    def do_GET(self):
        if self.path == "/sysinfo":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            info = {
                "hostname": socket.gethostname(),
                "platform": platform.platform(),
                "python": sys.version,
                "processor": platform.processor(),
                "cwd": os.getcwd(),
                "user": os.environ.get("USER", "unknown"),
                "shell": os.environ.get("SHELL", "unknown"),
                "cpu_count": os.cpu_count(),
                "pid": os.getpid(),
            }
            self.wfile.write(json.dumps(info, indent=2).encode())
            return
        return super().do_GET()

    def log_message(self, fmt, *args):
        # Quieter logging
        sys.stderr.write(f"[server] {self.address_string()} — {fmt % args}\n")


if __name__ == "__main__":
    print(f"⛧ OnyxBreach server")
    print(f"   Serving: {FRONTEND}")
    print(f"   Open:    http://127.0.0.1:{PORT}/")
    print(f"   Info:    http://127.0.0.1:{PORT}/sysinfo")
    print(f"   Bound to localhost only. Nothing leaves this device.\n")
    server = HTTPServer(("127.0.0.1", PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[server] Stopped.")
