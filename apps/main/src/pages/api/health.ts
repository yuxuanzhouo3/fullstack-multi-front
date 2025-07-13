import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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
    domains: {
      'rent.mornhub.net': 'active',
      'job.mornhub.net': 'active',
      'social.mornhub.net': 'active',
      'deepfake-detector.mornhub.net': 'active',
      'accelerator.mornhub.net': 'active'
    },
    deployment: {
      platform: 'Vercel',
      region: process.env.VERCEL_REGION || 'unknown',
      commit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
    }
  };

  res.status(200).json(systemInfo);
} 