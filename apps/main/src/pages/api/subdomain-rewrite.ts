import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const hostname = req.headers.host || '';
  
  // Map subdomains to their product routes
  const subdomainMap: { [key: string]: string } = {
    'rent.mornhub.net': '/rent',
    'job.mornhub.net': '/job',
    'social.mornhub.net': '/social',
    'deepfake.mornhub.net': '/deepfake',
    'accelerator.mornhub.net': '/accelerator'
  };

  if (subdomainMap[hostname]) {
    // Redirect to the appropriate product page
    res.redirect(307, `https://www.mornhub.net${subdomainMap[hostname]}`);
  } else {
    // Fallback to main dashboard
    res.redirect(307, 'https://www.mornhub.net');
  }
} 