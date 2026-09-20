#!/bin/bash
set -e

SERVER="root@66.179.242.92"
PASS="QlM7Lm2iMj5AF"
REMOTE_DIR="/root/syscom-sieeg"

echo "▶ Building..."
npm run build

echo "▶ Uploading .output..."
sshpass -p "$PASS" rsync -az --delete \
  --exclude='.git' \
  .output/ "$SERVER:$REMOTE_DIR/.output/"

echo "▶ Reloading PM2 (zero-downtime)..."
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$SERVER" \
  "cd $REMOTE_DIR && pm2 reload sieeg-syscom"

echo "✓ Deploy listo"
