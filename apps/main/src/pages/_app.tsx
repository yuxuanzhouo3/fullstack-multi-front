import type { AppProps } from 'next/app'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  // Handle subdomain routing at client level
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Map subdomains to their product routes
    const subdomainMap: { [key: string]: string } = {
      'rent.mornhub.net': '/rent',
      'job.mornhub.net': '/job',
      'social.mornhub.net': '/social',
      'deepfake.mornhub.net': '/deepfake',
      'accelerator.mornhub.net': '/accelerator'
    };

    if (subdomainMap[hostname] && window.location.pathname === '/') {
      // Redirect to the appropriate product page
      window.location.href = `https://mornhub.net${subdomainMap[hostname]}`;
      return null; // Don't render anything while redirecting
    }
  }

  return <Component {...pageProps} />
}
