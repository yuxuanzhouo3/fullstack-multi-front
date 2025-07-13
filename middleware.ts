import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const pathname = url.pathname;

  // Debug logging
  console.log('🔍 Middleware called:', { hostname, pathname, url: req.url });

  // Handle subdomain routing
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
    
    if (targetPath && pathname === '/') {
      console.log(`🔄 Redirecting ${hostname} to ${targetPath}`);
      return NextResponse.redirect(new URL(targetPath, req.url));
    }
  }

  // Add debugging headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Middleware-Processed', 'true');
  response.headers.set('X-Hostname', hostname);
  response.headers.set('X-Pathname', pathname);
  response.headers.set('X-Request-URL', req.url);
  
  // Add cache-busting for subdomains
  if (hostname.includes('.mornhub.net') && hostname !== 'mornhub.net' && hostname !== 'www.mornhub.net') {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Subdomain', hostname.split('.')[0]);
  }
  
  return response;
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