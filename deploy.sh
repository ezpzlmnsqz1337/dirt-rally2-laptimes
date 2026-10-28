#!/bin/bash -i

set -e

shopt -s expand_aliases
DESTINATION="hosting@hosting"

START_TIME=$(date +%s)

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   🚗 DIRT RALLY 2 LAPTIMES DEPLOYMENT   ║"
echo "║   Starting deployment to homelab...      ║"
echo "╚══════════════════════════════════════════╝"
echo ""

echo "🔍 Checking Podman availability..."
if ! command -v podman &> /dev/null; then
    echo "❌ ERROR: Podman is not installed or not in PATH"
    exit 1
fi

if ! podman ps &> /dev/null; then
    echo "❌ ERROR: Podman is not working properly. Please check your setup."
    echo "   Try: wsl --terminate podman-machine-default && wsl -d podman-machine-default"
    exit 1
fi
echo "✅ Podman is working!"
echo ""

echo "📦 Building Docker image..."
podman build --pull --rm -f 'Dockerfile' -t 'localhost/dirt-rally2-laptimes:latest' '.'
echo "✅ Build complete!"
echo ""

echo "💾 Saving image to tar..."
podman save localhost/dirt-rally2-laptimes:latest -o dirt-rally2-laptimes.tar
echo "✅ Image saved!"
echo ""

echo "📤 Copying image to homelab server..."
scp -r dirt-rally2-laptimes.tar $DESTINATION:/opt/containers/dirt-rally2-laptimes.tar
echo "✅ Image copied!"
echo ""

# Load image. Running containers keep the old image until they are restarted,
# so the site stays up during the transfer.
echo "📥 Loading image on homelab..."
ssh $DESTINATION 'podman load -i /opt/containers/dirt-rally2-laptimes.tar'
echo "✅ Image loaded!"
echo ""

# Deploy. The pod and its containers are Quadlet units shipped from
# deployment/quadlet/. Install them first (so a definition change is picked up),
# then restart only the app unit — Postgres and the API stay running.
echo "📦 Installing Quadlet units..."
DESTINATION="$DESTINATION" bash deployment/install-quadlet.sh
echo ""

echo "🚢 Restarting dirt-rally2-laptimes-app.service..."
ssh $DESTINATION 'systemctl --user restart dirt-rally2-laptimes-app.service && systemctl --user is-active dirt-rally2-laptimes-app.service'
echo "✅ Deployed!"
echo ""

echo "🧹 Cleaning up old images..."
ssh $DESTINATION 'podman image prune -f'
echo "✅ Cleanup complete!"
echo ""

echo "🧽 Cleaning local Podman VM artifacts..."
rm -f dirt-rally2-laptimes.tar
podman rmi -f localhost/dirt-rally2-laptimes:latest > /dev/null 2>&1 || true
podman image prune -a -f > /dev/null 2>&1 || true
podman builder prune -a -f > /dev/null 2>&1 || true
echo "✅ Local Podman cleanup complete!"
echo ""

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   ✨ DEPLOYMENT COMPLETE! ✨             ║"
echo "║   ⏱️  Total time: ${DURATION} seconds            ║"
echo "╚══════════════════════════════════════════╝"
echo ""
