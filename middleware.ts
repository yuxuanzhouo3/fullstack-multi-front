import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const pathname = url.pathname;

  // Debug logging
  console.log('🔍 Middleware called:', { hostname, pathname, url: req.url });

  // Handle subdomain routing - redirect to main domain product pages
  if (hostname.includes('.mornhub.net')) {
    const subdomain = hostname.split('.')[0];
    
    // Map subdomains to their product routes
    const subdomainMap = {
      'rent': '/rent',
      'job': '/job', 
      'social': '/social',
      'deepfake': '/deepfake',
      'accelerator': '/accelerator'
    };

    if (subdomain && subdomainMap[subdomain]) {
      console.log('🚀 Redirecting subdomain:', subdomain, 'to:', subdomainMap[subdomain]);
      
      // Create redirect URL to main domain product page
      let redirectUrl = `https://mornhub.net${subdomainMap[subdomain]}`;
      
      // Preserve query parameters
      if (url.search) {
        redirectUrl += url.search;
      }
      
      // Force redirect to the main domain product page
      return NextResponse.redirect(redirectUrl, 308);
    }
  }

  // Handle main domain product routes
  if (hostname === 'mornhub.net' || hostname === 'www.mornhub.net') {
    const productRoutes = ['/rent', '/job', '/social', '/deepfake', '/accelerator'];
    if (productRoutes.includes(pathname)) {
      console.log('✅ Main domain product route accessed:', pathname);
      // Let the page handle itself
      return NextResponse.next();
    }
  }

  console.log('➡️ No redirect needed, continuing...');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 