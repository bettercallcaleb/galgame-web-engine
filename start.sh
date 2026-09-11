#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PORT=8000
HOST=127.0.0.1
while [[ $# -gt 0 ]]; do
  case "$1" in
    --port|-p)
      PORT="${2:?missing port}"
      shift 2
      ;;
    --host)
      HOST="${2:?missing host}"
      shift 2
      ;;
    [0-9]*)
      PORT="$1"
      shift
      ;;
    *)
      echo "Usage: ./start.sh [--port PORT] [--host HOST]"
      exit 2
      ;;
  esac
done
echo "Open: http://${HOST}:${PORT}"
python3 -m http.server "$PORT" --bind "$HOST"
