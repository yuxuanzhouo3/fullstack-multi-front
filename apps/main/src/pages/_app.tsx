import type { AppProps } from 'next/app'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  // Handle subdomain routing at client level - AGGRESSIVE FALLBACK
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    // Map subdomains to their product routes
    const subdomainMap: { [key: string]: string } = {
      'rent.mornhub.net': '/rent',
      'job.mornhub.net': '/job',
      'social.mornhub.net': '/social',
      'deepfake.mornhub.net': '/deepfake',
      'accelerator.mornhub.net': '/accelerator'
    };

    // Check if we're on a subdomain and should redirect
    if (subdomainMap[hostname]) {
      console.log(`🚨 CLIENT-SIDE: Subdomain detected: ${hostname}, FORCING redirect to ${subdomainMap[hostname]}`);
      
      // Force redirect with cache-busting
      const redirectUrl = `https://mornhub.net${subdomainMap[hostname]}?from=${hostname.split('.')[0]}&t=${Date.now()}`;
      
      // Use replace to prevent back button issues
      window.location.replace(redirectUrl);
      return null; // Don't render anything while redirecting
    }

    // If we're on main domain but showing main dashboard on a product route, force redirect
    if ((hostname === 'mornhub.net' || hostname === 'www.mornhub.net') && pathname === '/') {
      const urlParams = new URLSearchParams(window.location.search);
      const fromSubdomain = urlParams.get('from');
      
      if (fromSubdomain && subdomainMap[`${fromSubdomain}.mornhub.net`]) {
        console.log(`🔄 CLIENT-SIDE: Redirecting from main to product: ${fromSubdomain}`);
        window.location.replace(`https://mornhub.net${subdomainMap[`${fromSubdomain}.mornhub.net`]}`);
        return null;
      }
    }
  }

  return <Component {...pageProps} />
}
// Updated at Sun Jul 13 17:03:56 EDT 2025
