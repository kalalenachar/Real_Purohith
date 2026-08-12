#!/bin/bash
# ==============================================================================
# Real-Purohit Quick Update Script
# Run this on your server whenever you push changes to GitHub!
# ==============================================================================

set -e

echo "========================================================"
echo " 🔄 Updating Real-Purohit Application..."
echo "========================================================"

# 1. Pull latest code from Git
echo "📥 [1/4] Pulling latest changes from GitHub..."
git pull

# 2. Install any new npm packages
echo "📦 [2/4] Installing/updating npm dependencies..."
npm install

# 3. Rebuild Vite frontend static bundle
echo "🛠️ [3/4] Rebuilding Vite frontend static bundle..."
npm run build

# 4. Restart backend Express process in PM2
echo "⚡ [4/4] Restarting backend Express API..."
pm2 restart realpurohith-api

echo "========================================================"
echo " 🎉 Real-Purohit successfully updated and live!"
echo "========================================================"
