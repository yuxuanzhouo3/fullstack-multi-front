#!/usr/bin/env node

// Development Server for Multi-Tenant System
const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const tenants = require('./config/tenants.json');
const urlMapping = require('./config/url-mapping.json');
const dnsConfig = require('./config/dns-config.json');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_PORT = process.env.BACKEND_PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.static('src'));
app.use(cookieParser());
app.use(session({
  secret: 'multi-tenant-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Domain-based routing middleware
app.use((req, res, next) => {
  const host = req.get('Host');
  const domain = host.split(':')[0]; // Remove port if present
  
  // Check if this is a mapped domain
  if (dnsConfig[domain]) {
    const mappedSlug = dnsConfig[domain];
    const tenant = tenants.find(t => t.slug === mappedSlug);
    
    if (tenant) {
      // Set the tenant in the request for later use
      req.mappedTenant = tenant;
      req.mappedSlug = mappedSlug;
    }
  }
  
  next();
});

// Real products for MornScience
const PRODUCTS = {
  'rent': {
    name: 'MornRent',
    theme: 'blue',
    features: ['property-listing', 'tenant-management', 'rental-payments'],
    apiEndpoint: `http://localhost:${BACKEND_PORT}/api`
  },
  'job': {
    name: 'MornJob',
    theme: 'green',
    features: ['job-postings', 'applicant-tracking', 'recruitment'],
    apiEndpoint: `http://localhost:${BACKEND_PORT}/api`
  },
  'social': {
    name: 'MornSocial',
    theme: 'purple',
    features: ['social-networking', 'messaging', 'content-sharing'],
    apiEndpoint: `http://localhost:${BACKEND_PORT}/api`
  },
  'deepfake_detector': {
    name: 'Deepfake Detector',
    theme: 'red',
    features: ['ai-detection', 'media-analysis', 'security'],
    apiEndpoint: `http://localhost:${BACKEND_PORT}/api`
  },
  'accelerator': {
    name: 'Accelerator - USA to China Access',
    theme: 'dark',
    features: ['secure-connection', 'privacy-protection', 'geo-unblocking'],
    apiEndpoint: `http://localhost:${BACKEND_PORT}/api`
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    products: Object.keys(PRODUCTS).length
  });
});

// Shared resources
app.get('/shared/:resource/*', (req, res) => {
  const { resource } = req.params;
  const filePath = req.params[0];
  const fullPath = path.join(__dirname, 'shared', resource, filePath);
  
  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
});

// Status page
app.get('/status', (req, res) => {
  const statusPath = path.join(__dirname, 'apps', 'status', 'dist', 'index.html');
  if (fs.existsSync(statusPath)) {
    res.sendFile(statusPath);
  } else {
    res.status(404).json({ error: 'Status page not found' });
  }
});

// Product-specific routes with access control
app.get('/:productId/*', (req, res) => {
  const { productId } = req.params;
  const filePath = req.params[0];
  
  if (!PRODUCTS[productId]) {
    return res.status(404).send('Page not found');
  }
  
  // Check if user has access to this product
  const userProduct = req.session?.currentProduct || req.cookies?.currentProduct;
  
  // If user is not assigned to this product, return generic 404
  if (userProduct && userProduct !== productId) {
    return res.status(404).send('Page not found');
  }
  
  // Serve product-specific files
  const fullPath = path.join(__dirname, 'apps', productId, 'dist', filePath);
  
  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    // Fallback to shared resources
    const sharedPath = path.join(__dirname, 'shared', filePath);
    if (fs.existsSync(sharedPath)) {
      res.sendFile(sharedPath);
    } else {
      res.status(404).send('Page not found');
    }
  }
});

// Product root routes with access control
app.get('/:productId', (req, res) => {
  const { productId } = req.params;
  
  if (!PRODUCTS[productId]) {
    return res.status(404).send('Page not found');
  }
  
  // Check if user has access to this product (session-based)
  const userProduct = req.session?.currentProduct || req.cookies?.currentProduct;
  
  // If user is not assigned to this product, return generic 404
  if (userProduct && userProduct !== productId) {
    return res.status(404).send('Page not found');
  }
  
  // Serve the index.html file for the product
  const indexPath = path.join(__dirname, 'apps', productId, 'dist', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    // Set session/cookie for this product
    if (!userProduct) {
      req.session = req.session || {};
      req.session.currentProduct = productId;
      res.cookie('currentProduct', productId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    }
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Page not found');
  }
});

// Tenant slug-based root route (supports both meaningful URLs and random slugs)
app.get('/:slug', (req, res) => {
  const { slug } = req.params;
  
  // First check if it's a meaningful URL
  const mappedSlug = urlMapping[slug];
  let tenant;
  
  if (mappedSlug) {
    // It's a meaningful URL, find the tenant by the mapped slug
    tenant = tenants.find(t => t.slug === mappedSlug);
  } else {
    // It might be a direct random slug
    tenant = tenants.find(t => t.slug === slug);
  }
  
  if (!tenant) return res.status(404).send('Page not found');

  // Session/cookie isolation logic (optional, can be added here)
  // ...

  // Serve the index.html file for the tenant's product
  const indexPath = path.join(__dirname, 'apps', tenant.id, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Page not found');
  }
});

// Tenant slug-based static files (supports both meaningful URLs and random slugs)
app.get('/:slug/*', (req, res) => {
  const { slug } = req.params;
  
  // First check if it's a meaningful URL
  const mappedSlug = urlMapping[slug];
  let tenant;
  
  if (mappedSlug) {
    // It's a meaningful URL, find the tenant by the mapped slug
    tenant = tenants.find(t => t.slug === mappedSlug);
  } else {
    // It might be a direct random slug
    tenant = tenants.find(t => t.slug === slug);
  }
  
  if (!tenant) return res.status(404).send('Page not found');
  const filePath = req.params[0];
  const fullPath = path.join(__dirname, 'apps', tenant.id, 'dist', filePath);
  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    // Fallback to shared resources
    const sharedPath = path.join(__dirname, 'shared', filePath);
    if (fs.existsSync(sharedPath)) {
      res.sendFile(sharedPath);
    } else {
      res.status(404).send('Page not found');
    }
  }
});

// API endpoints for development
app.get('/api/:productId/config', (req, res) => {
  const { productId } = req.params;
  const product = PRODUCTS[productId];
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({
    product,
    sharedResources: {
      nodeModules: '/shared/node_modules',
      commonStyles: '/shared/styles',
      commonScripts: '/shared/scripts'
    }
  });
});

app.get('/api/:productId/data', (req, res) => {
  const { productId } = req.params;
  const product = PRODUCTS[productId];
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // Generate mock data
  const mockData = {
    dashboard: {
      metrics: {
        users: Math.floor(Math.random() * 1000) + 500,
        revenue: Math.floor(Math.random() * 50000) + 20000,
        growth: Math.floor(Math.random() * 20) + 5
      },
      recent_activity: [
        { action: 'User login', timestamp: new Date().toISOString() },
        { action: 'Data update', timestamp: new Date().toISOString() },
        { action: 'System backup', timestamp: new Date().toISOString() }
      ]
    },
    features: product.features,
    theme: product.theme
  };
  
  res.json(mockData);
});

// Login endpoint for development
app.post('/api/auth/login', (req, res) => {
  const { username, password, productId } = req.body;
  
  if (!username || !password || !productId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (!PRODUCTS[productId]) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // Simple authentication for development
  if (username === 'admin' && password === 'password123') {
    const token = 'dev-token-' + Date.now();
    res.json({ 
      token, 
      product: PRODUCTS[productId],
      message: 'Development login successful'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Root route - show available products or serve domain-specific content
app.get('/', (req, res) => {
  // Check if this is a domain-based request
  if (req.mappedTenant) {
    // Serve the specific product for this domain
    const indexPath = path.join(__dirname, 'apps', req.mappedTenant.id, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    } else {
      return res.status(404).send('Page not found');
    }
  }

  // Show the main dashboard for localhost access
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Multi-Tenant System - Development</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .product { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .product h3 { margin: 0 0 10px 0; color: #333; }
            .product a { color: #007bff; text-decoration: none; }
            .product a:hover { text-decoration: underline; }
            .status { background: #d4edda; color: #155724; padding: 10px; border-radius: 4px; margin-bottom: 20px; }
            .domain-info { background: #fff3cd; color: #856404; padding: 10px; border-radius: 4px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <h1>🚀 Multi-Tenant System - Development Mode</h1>
        <div class="status">
            ✅ Server is running on port ${PORT}<br>
            📦 Serving ${Object.keys(PRODUCTS).length} applications<br>
            🔗 All applications share the same port (${PORT})
        </div>
        
        <div class="domain-info">
            <h3>🌐 Domain Access</h3>
            <p>Access applications directly via domains:</p>
            <ul>
                <li><strong>E-Commerce:</strong> <a href="http://mornshop.com:${PORT}" target="_blank">mornshop.com</a> or <a href="http://mornstore.com:${PORT}" target="_blank">mornstore.com</a></li>
                <li><strong>CRM System:</strong> <a href="http://morncrm.com:${PORT}" target="_blank">morncrm.com</a> or <a href="http://morncustomers.com:${PORT}" target="_blank">morncustomers.com</a></li>
                <li><strong>Project Management:</strong> <a href="http://mornprojects.com:${PORT}" target="_blank">mornprojects.com</a> or <a href="http://morntasks.com:${PORT}" target="_blank">morntasks.com</a></li>
            </ul>
        </div>
        
        <h2>Available Applications:</h2>
        ${tenants.map(tenant => {
            const product = PRODUCTS[tenant.id];
            // Construct subdomain for mornhub.net
            const subdomain = `${tenant.id}.mornhub.net`;
            return `
                <div class="product">
                    <h3>${product.name}</h3>
                    <p><strong>ID:</strong> ${tenant.id}</p>
                    <p><strong>Theme:</strong> ${product.theme}</p>
                    <p><strong>Features:</strong> ${product.features.join(', ')}</p>
                    <p><a href="https://${subdomain}" target="_blank">Access via Subdomain →</a></p>
                </div>
            `;
        }).join('')}
        
        <div class="product">
            <h3>System Status Dashboard</h3>
            <p>Monitor all applications and system resources</p>
            <p><a href="/status">View Status Dashboard →</a></p>
        </div>
        
        <h2>API Endpoints:</h2>
        <ul>
            <li><a href="/health">Health Check</a></li>
            <li><a href="/shared/styles/common.css">Shared CSS</a></li>
            <li><a href="/shared/scripts/utils.js">Shared JavaScript</a></li>
        </ul>
        
        <h2>Login Credentials:</h2>
        <p><strong>Username:</strong> admin</p>
        <p><strong>Password:</strong> password123</p>
    </body>
    </html>
  `;
  
  res.send(html);
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Multi-Tenant Development Server');
  console.log('==================================');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('🌐 Available Applications:');
  tenants.forEach(tenant => {
    const product = PRODUCTS[tenant.id];
    const meaningfulUrls = Object.entries(urlMapping)
      .filter(([key, value]) => value === tenant.slug)
      .map(([key, value]) => key);
    const domains = Object.entries(dnsConfig)
      .filter(([domain, slug]) => slug === tenant.slug)
      .map(([domain, slug]) => domain);
    
    console.log(`   • ${product.name}:`);
    console.log(`     Random Slug: http://localhost:${PORT}/${tenant.slug}`);
    if (meaningfulUrls.length > 0) {
      meaningfulUrls.forEach(url => {
        console.log(`     Meaningful URL: http://localhost:${PORT}/${url}`);
      });
    }
    if (domains.length > 0) {
      domains.forEach(domain => {
        console.log(`     Domain: http://${domain}:${PORT}`);
      });
    }
  });
  console.log(`   • Status Dashboard: http://localhost:${PORT}/status`);
  console.log('');
  console.log('🔑 Login Credentials: admin / password123');
  console.log('');
  console.log('💡 Press Ctrl+C to stop the server');
}); 