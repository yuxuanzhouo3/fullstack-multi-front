import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const pathname = url.pathname;

  // Debug logging
  console.log('Middleware called:', { hostname, pathname });

  // Handle subdomain routing
  if (hostname.endsWith('.mornhub.net')) {
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
      console.log('Rewriting subdomain:', subdomain, 'to path:', subdomainMap[subdomain]);
      // Rewrite to the specific product route
      url.pathname = subdomainMap[subdomain];
      return NextResponse.rewrite(url);
    }
  }

  // Handle main domain product routes
  if (hostname === 'mornhub.net' || hostname === 'www.mornhub.net') {
    const productRoutes = ['/rent', '/job', '/social', '/deepfake', '/accelerator'];
    if (productRoutes.includes(pathname)) {
      console.log('Main domain product route accessed:', pathname);
      // Let the page handle itself
      return NextResponse.next();
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 