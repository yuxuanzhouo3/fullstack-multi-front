import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const host = req.headers.host;
  const hostParts = host.split('.');
  let subdomain = hostParts.length > 2 ? hostParts[0] : null;

  // Map subdomains to product folders
  const productMap = {
    'rent': '1_rent',
    'job': '2_job', 
    'social': '3_social',
    'deepfake-detector': '4_deepfake_detector',
    'accelerator': '5_vpn'
  };

  // Serve dashboard for root domain (no subdomain)
  if (!subdomain) {
    const dashboardPath = path.join(process.cwd(), 'apps', 'status', 'dist', 'index.html');
    if (fs.existsSync(dashboardPath)) {
      const html = fs.readFileSync(dashboardPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } else {
      return res.status(404).json({ error: 'Dashboard not found', dashboardPath });
    }
  }

  // Otherwise, serve the product page for the subdomain
  const productFolder = productMap[subdomain];
  const indexPath = productFolder ? path.join(process.cwd(), 'apps', productFolder, 'index.html') : null;
  const fileExists = indexPath ? fs.existsSync(indexPath) : false;

  if (!productFolder) {
    return res.status(404).json({ error: 'Product not found', host, subdomain });
  }

  try {
    if (fileExists) {
      const html = fs.readFileSync(indexPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } else {
      return res.status(404).json({ error: 'Product frontend not found', indexPath });
    }
  } catch (error) {
    console.error('Error serving product:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} 