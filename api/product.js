import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const host = req.headers.host;
  const mainDomain = 'mornhub.net';

  // Serve dashboard for root domain and www
  if (host === mainDomain || host === `www.${mainDomain}`) {
    const dashboardPath = path.join(process.cwd(), 'src', 'index.html');
    try {
      const html = await fs.readFile(dashboardPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.status(200).end(html);
    } catch (err) {
      res.status(404).end('Dashboard not found');
    }
    return;
  }

  // Extract subdomain (handles multi-level subdomains)
  let subdomain = null;
  const regex = new RegExp(`^(.*?)\\.${mainDomain.replace('.', '\\.')}$`);
  const match = host.match(regex);
  if (match) {
    subdomain = match[1];
  }

  if (!subdomain) {
    // fallback: show dashboard if no subdomain
    const dashboardPath = path.join(process.cwd(), 'src', 'index.html');
    try {
      const html = await fs.readFile(dashboardPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.status(200).end(html);
    } catch (err) {
      res.status(404).end('Dashboard not found');
    }
    return;
  }

  // Map subdomain to product folder
  let productDir = null;
  if (subdomain === 'rent') productDir = '1_rent';
  else if (subdomain === 'job') productDir = '2_job';
  else if (subdomain === 'social') productDir = '3_social';
  else if (subdomain === 'deepfake_detector') productDir = '4_deepfake_detector';
  else if (subdomain === 'accelerator') productDir = '5_accelerator';
  else if (/^product-\d+$/.test(subdomain)) productDir = subdomain; // e.g., product-1234
  else productDir = subdomain; // fallback for any other custom product

  // Serve the product's index.html
  const productPath = path.join(process.cwd(), 'apps', productDir, 'dist', 'index.html');
  try {
    const html = await fs.readFile(productPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).end(html);
  } catch (err) {
    res.status(404).end('Product not found');
  }
} 