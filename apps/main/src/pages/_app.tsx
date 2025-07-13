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

    // Check if we're on a subdomain and should redirect
    if (subdomainMap[hostname]) {
      console.log(`Subdomain detected: ${hostname}, redirecting to ${subdomainMap[hostname]}`);
      
      // Always redirect subdomain users to the main domain product page
      const targetUrl = `https://mornhub.net${subdomainMap[hostname]}`;
      console.log(`Redirecting to: ${targetUrl}`);
      
      // Use replace to avoid back button issues
      window.location.replace(targetUrl);
      return null; // Don't render anything while redirecting
    }
  }

  return <Component {...pageProps} />
}
