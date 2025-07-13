import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const pathname = url.pathname;

  // Debug logging
  console.log('🔍 Middleware called:', { hostname, pathname, url: req.url });

  // Handle subdomain routing - redirect to main domain product pages
  if (hostname.includes('.mornhub.net') && hostname !== 'mornhub.net' && hostname !== 'www.mornhub.net') {
    const subdomain = hostname.split('.')[0];
    
    // Map subdomains to their product pages
    const subdomainMap = {
      'rent': '/rent',
      'job': '/job', 
      'social': '/social',
      'deepfake': '/deepfake',
      'accelerator': '/accelerator'
    };
    
    const targetPath = subdomainMap[subdomain];
    
    if (targetPath) {
      // For subdomain root path (/), redirect to the product page on main domain
      if (pathname === '/') {
        console.log(`🔄 Subdomain redirect: ${subdomain}.mornhub.net/ -> mornhub.net${targetPath}`);
        const redirectUrl = new URL(targetPath, 'https://mornhub.net');
        return NextResponse.redirect(redirectUrl, 308); // Permanent redirect
      }
      
      // For other paths on subdomain, redirect to main domain with same path
      console.log(`🔄 Subdomain path redirect: ${subdomain}.mornhub.net${pathname} -> mornhub.net${pathname}`);
      const redirectUrl = new URL(pathname, 'https://mornhub.net');
      return NextResponse.redirect(redirectUrl, 308); // Permanent redirect
    }
  }

  // Add cache-busting headers for subdomains
  if (hostname.includes('.mornhub.net') && hostname !== 'mornhub.net' && hostname !== 'www.mornhub.net') {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // For main domain, let all routes pass through normally
  // This ensures /rent, /job, etc. serve their own content
  // and the main dashboard (/) serves its own content
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