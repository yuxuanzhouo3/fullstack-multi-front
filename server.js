const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Redis = require('redis');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const dnsConfig = require('./config/dns-config.json');

// Environment variables
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Redis client for session management
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redis = Redis.createClient({
  url: process.env.REDIS_URL || `redis://localhost:${REDIS_PORT}`
});

// MongoDB connection (commented out for now)
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/multi-tenant', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// Session management
const sessions = new Map();

// Product configurations
const BACKEND_PORT = process.env.BACKEND_PORT || 8000;

const PRODUCTS = {
  'product-1': {
    name: 'E-Commerce Platform',
    theme: 'blue',
    features: ['shopping-cart', 'payment', 'inventory'],
    apiEndpoint: `http://localhost:${BACKEND_PORT}/api`
  },
  'product-2': {
    name: 'CRM System',
    theme: 'green',
    features: ['contacts', 'leads', 'analytics'],
    apiEndpoint: `http://localhost:${BACKEND_PORT}/api`
  },
  'product-3': {
    name: 'Project Management',
    theme: 'purple',
    features: ['tasks', 'timeline', 'collaboration'],
    apiEndpoint: `http://localhost:${BACKEND_PORT}/api`
  }
  // ... 997 more products will be generated
};

// Generate 1000 products
for (let i = 4; i <= 1000; i++) {
  const themes = ['blue', 'green', 'purple', 'orange', 'red', 'teal', 'pink', 'indigo'];
  const featureSets = [
    ['analytics', 'dashboard', 'reports'],
    ['messaging', 'notifications', 'chat'],
    ['file-management', 'storage', 'sharing'],
    ['user-management', 'roles', 'permissions'],
    ['billing', 'subscriptions', 'payments'],
    ['workflow', 'automation', 'integrations']
  ];
  
  PRODUCTS[`product-${i}`] = {
    name: `Business Solution ${i}`,
    theme: themes[i % themes.length],
    features: featureSets[i % featureSets.length],
    apiEndpoint: `http://localhost:${BACKEND_PORT}/api`
  };
}

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Product access middleware
const checkProductAccess = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.id;
  
  // Check if user has access to this product
  const userSession = await redis.get(`session:${userId}`);
  if (userSession) {
    const session = JSON.parse(userSession);
    if (session.currentProduct !== productId) {
      return res.status(403).json({ error: 'Access denied to this product' });
    }
  }
  
  next();
};

// Map product slugs to their app directory names
const appDirMap = {
  'rent': '1_rent',
  'job': '2_job', 
  'social': '3_social',
  'deepfake_detector': '4_deepfake_detector',
  'accelerator': '5_accelerator'
};

// Helper: get product slug from host
function getProductSlugFromHost(host) {
  // Remove port if present
  const cleanHost = host.split(':')[0];
  return dnsConfig[cleanHost];
}

// Health check - must come before root route
app.get('/health', (req, res) => {
  console.log('HEALTH endpoint hit');
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes - must come before root route
app.post('/api/auth/login', async (req, res) => {
  const { username, password, productId } = req.body;
  
  if (!username || !password || !productId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (!PRODUCTS[productId]) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // In a real app, you'd validate against a database
  const hashedPassword = await bcrypt.hash('password123', 10);
  const isValidPassword = await bcrypt.compare(password, hashedPassword);
  
  if (username === 'admin' && isValidPassword) {
    const token = jwt.sign(
      { id: uuidv4(), username, productId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Store session
    await redis.set(`session:${token}`, JSON.stringify({
      currentProduct: productId,
      loginTime: new Date().toISOString()
    }));
    
    res.json({ token, product: PRODUCTS[productId] });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { username, password, productId } = req.body;
  if (!username || !password || !productId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // In a real app, you'd check if user exists and hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Store user in Redis for demo (use DB in production)
  await redis.set(`user:${username}`, JSON.stringify({ username, hashedPassword, productId }));
  res.json({ success: true, message: 'User registered' });
});

// Payment endpoint (mock)
app.post('/api/payment/charge', async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  // Simulate payment processing
  res.json({ success: true, message: `Charged $${amount}` });
});

// Chat endpoints
app.post('/api/chat/send', async (req, res) => {
  const { message, username } = req.body;
  if (!message || !username) {
    return res.status(400).json({ error: 'Missing message or username' });
  }
  // Store message in Redis list
  await redis.rpush('chat:messages', JSON.stringify({ username, message, time: Date.now() }));
  res.json({ success: true, message });
});

app.get('/api/chat/history', async (req, res) => {
  const messages = await redis.lrange('chat:messages', 0, 49);
  res.json({ success: true, messages: messages.map(m => JSON.parse(m)) });
});

// Analytics endpoint (Supabase example)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get('/api/analytics/get', async (req, res) => {
  try {
    const { data, error } = await supabase.from('analytics').select('*').limit(10);
    if (error) throw error;
    res.json({ success: true, analytics: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Product-specific routes
app.get('/api/:productId/config', authenticateUser, checkProductAccess, (req, res) => {
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

// Shared resources endpoint
app.get('/shared/:resource/*', (req, res) => {
  const { resource } = req.params;
  const filePath = req.params[0];
  
  // Serve shared resources (node_modules, common styles, etc.)
  const fullPath = path.join(__dirname, 'shared', resource, filePath);
  
  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
});

// Map product slugs to their app/dist directories
const PRODUCT_STATIC_MAP = {
  'rent': '1_rent',
  'job': '2_job',
  'social': '3_social',
  'deepfake': '4_deepfake_detector',
  'accelerator': '5_accelerator'
};

// Serve product main pages like /rent/index.html
app.get(['/:productSlug/index.html', '/:productSlug/'], (req, res) => {
  const { productSlug } = req.params;
  const appDir = PRODUCT_STATIC_MAP[productSlug];
  if (appDir) {
    const filePath = path.join(__dirname, 'apps', appDir, 'dist', 'index.html');
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  res.status(404).send('Product page not found');
});

// Serve static assets for each product, e.g. /rent/*
app.get('/:productSlug/*', (req, res) => {
  const { productSlug } = req.params;
  const appDir = PRODUCT_STATIC_MAP[productSlug];
  if (appDir) {
    const assetPath = req.params[0];
    const filePath = path.join(__dirname, 'apps', appDir, 'dist', assetPath);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  res.status(404).send('Asset not found');
});

// Static public assets (must be after all API/product routes, before catch-all)
app.use('/src', express.static(path.join(__dirname, 'src')));

// WebSocket for real-time features
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-product', (productId) => {
    socket.join(productId);
    console.log(`Client ${socket.id} joined product ${productId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Subdomain-based routing: serve product main page (MUST BE LAST)
app.get('*', (req, res) => {
  const host = req.headers.host;
  const productSlug = getProductSlugFromHost(host);
  console.log(`[DEBUG] Incoming host: ${host}, mapped productSlug: ${productSlug}`);
  if (productSlug && appDirMap[productSlug]) {
    const filePath = path.join(__dirname, 'apps', appDirMap[productSlug], 'dist', 'index.html');
    console.log(`[DEBUG] Attempting to serve: ${filePath}`);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      console.log(`[DEBUG] File not found: ${filePath}`);
    }
  } else {
    if (!productSlug) {
      console.log(`[DEBUG] No productSlug mapped for host: ${host}`);
    } else {
      console.log(`[DEBUG] No appDir found for productSlug: ${productSlug}`);
    }
  }
  // Fallback to main landing page
  console.log('[DEBUG] Falling back to main landing page');
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Multi-tenant server running on port ${PORT}`);
  console.log(`📊 Serving ${Object.keys(PRODUCTS).length} products`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  // Print all registered routes
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log(`[ROUTE] ${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path}`);
    }
  });
});

module.exports = { app, server, PRODUCTS }; 