#!/bin/bash
set -e

LOGS_DIR="/app/.logs"
mkdir -p "$LOGS_DIR"

# Check if already running
if [ -f "$LOGS_DIR/app.pid" ]; then
  PID=$(cat "$LOGS_DIR/app.pid")
  if kill -0 "$PID" 2>/dev/null; then
    echo "==> Dev server already running (PID: $PID)"
    exit 0
  fi
  rm -f "$LOGS_DIR/app.pid"
fi

echo "==> Starting dev server..."
cd /app
nohup npm run dev > "$LOGS_DIR/app.log" 2>&1 &
echo $! > "$LOGS_DIR/app.pid"
echo "==> Dev server started (PID: $(cat "$LOGS_DIR/app.pid"), logs: $LOGS_DIR/app.log)"
