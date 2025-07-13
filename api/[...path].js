// Catch-all API handler to work within Vercel's Hobby plan limits
export default async function handler(req, res) {
  const { path } = req.query;
  const fullPath = Array.isArray(path) ? path.join('/') : path || '';
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Route to different handlers based on path
    if (fullPath === 'health' || fullPath === 'system/health') {
      // Health check endpoint
      const systemInfo = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'MornHub Multi-Product Platform',
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
        products: {
          rent: { status: 'active', url: '/rent' },
          job: { status: 'active', url: '/job' },
          social: { status: 'active', url: '/social' },
          deepfake_detector: { status: 'active', url: '/deepfake-detector' },
          accelerator: { status: 'active', url: '/accelerator' }
        },
        deployment: {
          platform: 'Vercel',
          region: process.env.VERCEL_REGION || 'unknown'
        }
      };
      
      res.status(200).json(systemInfo);
    } else if (fullPath.startsWith('products/')) {
      // Product-specific endpoints
      res.status(200).json({ 
        message: 'Product API endpoint',
        path: fullPath,
        method: req.method
      });
    } else if (fullPath.startsWith('shared/')) {
      // Shared API endpoints
      res.status(200).json({ 
        message: 'Shared API endpoint',
        path: fullPath,
        method: req.method
      });
    } else {
      // Default response
      res.status(404).json({ 
        error: 'API endpoint not found',
        path: fullPath
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
} 