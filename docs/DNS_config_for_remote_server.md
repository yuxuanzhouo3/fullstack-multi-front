# DNS Configuration for Remote Server Deployment

## 🌐 Overview

This document provides complete DNS configuration instructions for deploying your MornScience multi-tenant system to a remote server. The system serves 5 products through domain-based routing on a single server.

## 🚀 Products Overview

| Product | Domain | Internal ID | Features |
|---------|--------|-------------|----------|
| **MornRent** | `rent.mornscience.com` | `rent` | Property listings, tenant management, rental payments |
| **MornJob** | `job.mornscience.com` | `job` | Job postings, applicant tracking, recruitment |
| **MornSocial** | `social.mornscience.com` | `social` | Social networking, messaging, content sharing |
| **Deepfake Detector** | `deepfake-detector.mornscience.com` | `deepfake_detector` | AI detection, media analysis, security |
| **Accelerator** | `accelerator.mornscience.com` | `accelerator` | USA to China access platform |

## 📋 Prerequisites

- Remote server with public IP address
- Domain registrar access (GoDaddy, Namecheap, etc.)
- SSL certificate (Let's Encrypt recommended)
- Node.js installed on server

## 🔧 DNS Configuration Steps

### Step 1: Get Your Server IP Address

```bash
# On your remote server, get the public IP
curl ifconfig.me
# or
curl ipinfo.io/ip
```

**Example:** Your server IP is `203.0.113.1`

### Step 2: Configure DNS Records

In your domain registrar's DNS management panel, add the following **A Records**:

#### Primary Product Domains

| Domain | Type | Value | TTL |
|--------|------|-------|-----|
| `rent.mornscience.com` | A | `203.0.113.1` | 300 |
| `job.mornscience.com` | A | `203.0.113.1` | 300 |
| `social.mornscience.com` | A | `203.0.113.1` | 300 |
| `deepfake-detector.mornscience.com` | A | `203.0.113.1` | 300 |
| `accelerator.mornscience.com` | A | `203.0.113.1` | 300 |

#### Optional: Alternative Domains

| Domain | Type | Value | TTL |
|--------|------|-------|-----|
| `mornrent.com` | A | `203.0.113.1` | 300 |
| `mornjob.com` | A | `203.0.113.1` | 300 |
| `mornsocial.com` | A | `203.0.113.1` | 300 |
| `accelerator.com` | A | `203.0.113.1` | 300 |

### Step 3: SSL Certificate Configuration

#### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot

# Get SSL certificates for all domains
sudo certbot certonly --standalone -d rent.mornscience.com
sudo certbot certonly --standalone -d job.mornscience.com
sudo certbot certonly --standalone -d social.mornscience.com
sudo certbot certonly --standalone -d deepfake-detector.mornscience.com
sudo certbot certonly --standalone -d accelerator.mornscience.com
```

#### Using Nginx (Alternative)

```nginx
# /etc/nginx/sites-available/mornscience
server {
    listen 80;
    server_name rent.mornscience.com job.mornscience.com social.mornscience.com deepfake-detector.mornscience.com accelerator.mornscience.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name rent.mornscience.com;
    
    ssl_certificate /etc/letsencrypt/live/rent.mornscience.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rent.mornscience.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Repeat for each domain...
```

## 🚀 Server Deployment

### Step 1: Upload Your Code

```bash
# On your remote server
git clone https://github.com/your-username/fronts-all-in-one.git
cd fronts-all-in-one
npm install
```

### Step 2: Configure Environment

```bash
# Create production environment file
cat > .env << EOF
NODE_ENV=production
PORT=3000
REDIS_URL=redis://localhost:6379
MONGODB_URI=mongodb://localhost:27017/mornscience
EOF
```

### Step 3: Update Configuration Files

#### Update `dns-config.json`

```json
{
  "rent.mornscience.com": "rent",
  "job.mornscience.com": "job",
  "social.mornscience.com": "social",
  "deepfake-detector.mornscience.com": "deepfake_detector",
  "accelerator.mornscience.com": "accelerator"
}
```

#### Update `tenants.json`

```json
[
  { "id": "rent", "slug": "rent", "displayName": "MornRent" },
  { "id": "job", "slug": "job", "displayName": "MornJob" },
  { "id": "social", "slug": "social", "displayName": "MornSocial" },
  { "id": "deepfake_detector", "slug": "deepfake_detector", "displayName": "Deepfake Detector" },
  { "id": "accelerator", "slug": "accelerator", "displayName": "Accelerator" }
]
```

### Step 4: Start the Server

```bash
# Install PM2 for process management
npm install -g pm2

# Start the server
pm2 start dev-start.js --name "mornscience-multi-tenant"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🌐 Testing Your Configuration

### DNS Propagation Check

```bash
# Check if DNS is propagated
nslookup rent.mornscience.com
nslookup job.mornscience.com
nslookup social.mornscience.com
nslookup deepfake-detector.mornscience.com
nslookup accelerator.mornscience.com
```

### Domain Access Test

```bash
# Test each domain
curl -I https://rent.mornscience.com
curl -I https://job.mornscience.com
curl -I https://social.mornscience.com
curl -I https://deepfake-detector.mornscience.com
curl -I https://accelerator.mornscience.com
```

## 📊 Expected Results

### For Real Users

When users visit your domains, they should see:

| Domain | Product | Features |
|--------|---------|----------|
| `https://rent.mornscience.com` | MornRent | Property listings, tenant management, rental payments |
| `https://job.mornscience.com` | MornJob | Job postings, applicant tracking, recruitment |
| `https://social.mornscience.com` | MornSocial | Social networking, messaging, content sharing |
| `https://deepfake-detector.mornscience.com` | Deepfake Detector | AI detection, media analysis, security |
| `https://accelerator.mornscience.com` | Accelerator | USA to China access platform |

### Server Response Headers

```bash
# Expected response headers
HTTP/1.1 200 OK
X-Powered-By: Express
Set-Cookie: currentProduct=rent; Max-Age=86400; Path=/; HttpOnly
Content-Type: text/html; charset=UTF-8
```

## 🔒 Security Considerations

### 1. SSL/TLS Configuration

```bash
# Strong SSL configuration
cat > /etc/nginx/ssl.conf << EOF
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
EOF
```

### 2. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 3. Rate Limiting

```bash
# Install rate limiting
npm install express-rate-limit

# Add to your server code
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

## 📈 Monitoring and Logs

### PM2 Monitoring

```bash
# Monitor your application
pm2 monit

# View logs
pm2 logs mornscience-multi-tenant

# Restart if needed
pm2 restart mornscience-multi-tenant
```

### Nginx Logs

```bash
# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

## 🚨 Troubleshooting

### Common Issues

1. **DNS Not Propagated**
   ```bash
   # Wait 24-48 hours for full propagation
   # Check with: nslookup rent.mornscience.com
   ```

2. **SSL Certificate Issues**
   ```bash
   # Renew certificates
   sudo certbot renew
   ```

3. **Server Not Responding**
   ```bash
   # Check if server is running
   pm2 status
   
   # Check port usage
   sudo netstat -tlnp | grep :3000
   ```

4. **Domain Routing Issues**
   ```bash
   # Check server logs
   pm2 logs mornscience-multi-tenant
   
   # Test domain detection
   curl -H "Host: rent.mornscience.com" http://localhost:3000
   ```

## 📞 Support

If you encounter issues:

1. Check server logs: `pm2 logs mornscience-multi-tenant`
2. Verify DNS propagation: `nslookup your-domain.com`
3. Test SSL certificates: `curl -I https://your-domain.com`
4. Check firewall: `sudo ufw status`

## 🎯 Summary

Your multi-tenant system will serve 5 products through domain-based routing:

- **Single Server**: All products run on one server
- **Domain Routing**: Each domain serves a specific product
- **SSL Security**: HTTPS for all domains
- **Shared Resources**: Efficient memory usage
- **Easy Scaling**: Add more products by adding domains

Users simply visit the domain for the product they want, and your server automatically routes them to the correct application! 