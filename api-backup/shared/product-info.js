export default async function handler(req, res) {
  const products = [
    {
      id: 'rent',
      name: 'Rent',
      description: 'Find your perfect rental property',
      subdomain: 'rent.accelerator.mornhub.net',
      folder: '1_rent'
    },
    {
      id: 'job',
      name: 'Job',
      description: 'Discover career opportunities',
      subdomain: 'job.accelerator.mornhub.net',
      folder: '2_job'
    },
    {
      id: 'social',
      name: 'Social',
      description: 'Connect with friends and family',
      subdomain: 'social.accelerator.mornhub.net',
      folder: '3_social'
    },
    {
      id: 'deepfake-detector',
      name: 'Deepfake Detector',
      description: 'AI-powered deepfake detection',
      subdomain: 'deepfake-detector.accelerator.mornhub.net',
      folder: '4_deepfake_detector'
    },
    {
      id: 'accelerator',
      name: 'Accelerator',
      description: 'Network acceleration and optimization',
      subdomain: 'accelerator.accelerator.mornhub.net',
      folder: '5_vpn'
    }
  ];

  res.status(200).json({ products });
} 