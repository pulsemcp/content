#!/bin/bash
set -euo pipefail

# Configuration
DROPLET_IP="24.199.97.28"
REMOTE_USER="root"
APP_DIR="/opt/linear-clone"
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=10"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Deploying Linear Clone to ${DROPLET_IP}..."

# Step 1: Install Docker and Docker Compose on the droplet if not present
echo "==> Ensuring Docker is installed on the droplet..."
ssh $SSH_OPTS ${REMOTE_USER}@${DROPLET_IP} bash <<'REMOTE_SETUP'
set -euo pipefail

# Add swap if not present (1GB droplet needs it for Docker builds)
if [ ! -f /swapfile ]; then
    echo "==> Creating 1GB swap..."
    fallocate -l 1G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "==> Installing Docker..."
    apt-get update -qq
    apt-get install -y -qq ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    echo "==> Docker installed successfully"
else
    echo "==> Docker already installed"
fi

# Create app directory
mkdir -p ${APP_DIR:-/opt/linear-clone}
REMOTE_SETUP

# Step 2: Sync application code to the droplet (exclude node_modules and .git)
echo "==> Syncing application code..."
rsync -azP --delete \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='deploy.sh' \
    -e "ssh ${SSH_OPTS}" \
    "${SCRIPT_DIR}/" \
    ${REMOTE_USER}@${DROPLET_IP}:${APP_DIR}/

# Step 3: Build and start the containers
echo "==> Building and starting containers..."
ssh $SSH_OPTS ${REMOTE_USER}@${DROPLET_IP} bash <<REMOTE_DEPLOY
set -euo pipefail
cd ${APP_DIR}

# Stop existing containers if running
docker compose down --remove-orphans 2>/dev/null || true

# Build and start
docker compose up -d --build

# Wait for services to be healthy
echo "==> Waiting for services to start..."
sleep 10

# Check service status
echo "==> Container status:"
docker compose ps

echo ""
echo "==> Deployment complete!"
echo "==> App available at: http://${DROPLET_IP}:5173"
REMOTE_DEPLOY

echo ""
echo "========================================="
echo "  Deployment successful!"
echo "  App URL: http://${DROPLET_IP}:5173"
echo "========================================="
