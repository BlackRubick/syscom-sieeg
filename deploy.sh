#!/bin/bash
set -e

SERVER="root@66.179.242.92"
# La contraseña vive en .deploy.env (no se sube a git): SIEEG_SSH_PASS=...
[ -f "$(dirname "$0")/.deploy.env" ] && . "$(dirname "$0")/.deploy.env"
PASS="${SIEEG_SSH_PASS:?Falta SIEEG_SSH_PASS (créalo en .deploy.env)}"
REMOTE_DIR="/root/syscom-sieeg"

echo "▶ Pruebas y tipos..."
npm test

echo "▶ Building..."
npm run build

echo "▶ Uploading .output..."
sshpass -p "$PASS" rsync -az --delete \
  --exclude='.git' \
  .output/ "$SERVER:$REMOTE_DIR/.output/"

echo "▶ Reloading PM2 (zero-downtime)..."
# --update-env vuelve a leer el .env del servidor (ecosystem.config.cjs) por si cambió algún secreto
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no "$SERVER" \
  "cd $REMOTE_DIR && pm2 reload ecosystem.config.cjs --update-env && pm2 save >/dev/null"

echo "✓ Deploy listo"
