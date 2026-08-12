#!/bin/bash
# ==============================================================================
# Real-Purohit Oracle Cloud Ubuntu Deployment Automation Script
# Domain: realpurohith.run.place | Public IP: 129.225.124.27
# ==============================================================================

set -e

DOMAIN="realpurohith.run.place"
PUBLIC_IP="129.225.124.27"
APP_DIR=$(pwd)

echo "========================================================"
echo " 🚀 Deploying Real-Purohit on Oracle Ubuntu Instance "
echo " Domain: $DOMAIN ($PUBLIC_IP)"
echo " Working Directory: $APP_DIR"
echo "========================================================"

# 1. Update system & install Node.js 20 + build tools
echo "📦 [1/6] Updating packages & installing Node.js 20 + build tools..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl build-essential git nginx certbot python3-certbot-nginx netfilter-persistent

if ! command -v node &> /dev/null || [[ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 18 ]]; then
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "✅ Node version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# 2. Configure Oracle Ubuntu Firewall (iptables)
echo "🔒 [2/6] Opening ports 80 (HTTP) & 443 (HTTPS) in Ubuntu firewall..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT || true
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT || true
sudo netfilter-persistent save || true

# 3. Install project dependencies and build frontend
echo "🛠️ [3/6] Installing npm packages & building Vite frontend..."
npm install
npm run build

# 4. Install PM2 and start Express backend
echo "⚡ [4/6] Setting up PM2 for Express SQLite backend..."
sudo npm install -g pm2
pm2 stop realpurohith-api 2>/dev/null || true
pm2 start server/server.js --name "realpurohith-api"
pm2 save

# Setup PM2 auto-restart on server reboot
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || true

# 5. Configure Nginx Reverse Proxy
echo "🌐 [5/6] Configuring Nginx reverse proxy..."
NGINX_CONF="/etc/nginx/sites-available/realpurohith"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    listen 80;
    server_name $DOMAIN $PUBLIC_IP;

    # Vite Frontend Build
    root $APP_DIR/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend Single Page App Router fallback
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API Requests to Express backend on port 5000
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/realpurohith /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "========================================================"
echo " 🎉 Deployment Complete!"
echo " App URL: http://$DOMAIN"
echo " Direct IP: http://$PUBLIC_IP"
echo " Health Check: http://$DOMAIN/api/health"
echo "--------------------------------------------------------"
echo " 🔒 To enable FREE HTTPS (SSL Certificate), run:"
echo " sudo certbot --nginx -d $DOMAIN"
echo "========================================================"
