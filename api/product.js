const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const host = req.headers.host || '';
  // Remove port if present
  const cleanHost = host.split(':')[0];
  const parts = cleanHost.split('.');

  // Adjust for www or multi-level subdomains
  let subdomain = '';
  if (parts.length > 2) {
    subdomain = parts[0];
  }

  // Map subdomains to product folders
  const productMap = {
    rent: '1_rent',
    job: '2_job',
    social: '3_social',
    'deepfake-detector': '4_deepfake_detector',
    accelerator: '5_accelerator'
  };

  // Serve dashboard for root domain (no subdomain)
  if (!subdomain || subdomain === 'www') {
    const dashboardPath = path.join(__dirname, '../apps/status/dist/index.html');
    if (fs.existsSync(dashboardPath)) {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).end(fs.readFileSync(dashboardPath, 'utf8'));
      return;
    } else {
      res.status(404).end('Dashboard not found');
      return;
    }
  }

  // Serve product frontends for subdomains
  const folder = productMap[subdomain];
  if (folder) {
    const filePath = path.join(__dirname, `../apps/${folder}/dist/index.html`);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).end(fs.readFileSync(filePath, 'utf8'));
      return;
    }
  }

  res.status(404).end('Product not found');
}; 