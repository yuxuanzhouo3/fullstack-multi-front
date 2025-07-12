import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const host = req.headers.host;
  // Extract subdomain robustly (handles www and multi-level domains)
  const hostParts = host.split('.');
  let subdomain = hostParts.length > 2 ? hostParts[0] : null;

  // Debug logging
  console.log('[Product Handler] Host:', host, '| Subdomain:', subdomain);

  // Map subdomains to product folders
  const productMap = {
    'rent': '1_rent',
    'job': '2_job', 
    'social': '3_social',
    'deepfake-detector': '4_deepfake_detector',
    'accelerator': '5_vpn'
  };

  const productFolder = subdomain ? productMap[subdomain] : null;

  if (!productFolder) {
    console.log('[Product Handler] No product folder found for subdomain:', subdomain);
    return res.status(404).json({ error: 'Product not found' });
  }

  try {
    // Try to serve the product's index.html
    const indexPath = path.join(process.cwd(), 'apps', productFolder, 'index.html');
    console.log('[Product Handler] indexPath:', indexPath);
    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } else {
      console.log('[Product Handler] index.html not found for', productFolder);
      return res.status(404).json({ error: 'Product frontend not found' });
    }
  } catch (error) {
    console.error('Error serving product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 