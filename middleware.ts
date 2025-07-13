import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const pathname = url.pathname;

  // Debug logging
  console.log('🔍 Middleware called:', { hostname, pathname, url: req.url });

  // Handle subdomain routing - force redirect to main domain product pages
  if (hostname.includes('.mornhub.net') && hostname !== 'mornhub.net' && hostname !== 'www.mornhub.net') {
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
      console.log('🚀 FORCING subdomain redirect:', subdomain, 'to:', subdomainMap[subdomain]);
      
      // Create redirect URL with cache-busting parameters
      const redirectUrl = new URL(subdomainMap[subdomain], 'https://mornhub.net');
      redirectUrl.searchParams.set('from', subdomain);
      redirectUrl.searchParams.set('t', Date.now().toString());
      
      // Force redirect with cache-busting headers
      const response = NextResponse.redirect(redirectUrl, 302);
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      response.headers.set('X-Subdomain-Redirect', subdomain);
      
      return response;
    }
  }

  // Handle main domain product routes - ensure they serve correct content
  if (hostname === 'mornhub.net' || hostname === 'www.mornhub.net') {
    const productRoutes = ['/rent', '/job', '/social', '/deepfake', '/accelerator'];
    
    if (productRoutes.includes(pathname)) {
      console.log('✅ Serving product route:', pathname);
      
      // Add headers to ensure correct content is served
      const response = NextResponse.next();
      response.headers.set('X-Product-Route', pathname);
      response.headers.set('Cache-Control', 'public, max-age=3600');
      
      return response;
    }
  }

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