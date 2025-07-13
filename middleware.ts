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
    
    if (targetPath) {
      console.log(`🔄 Subdomain detected: ${subdomain}.mornhub.net -> ${targetPath}`);
      
      // For root path, redirect to the product page
      if (pathname === '/') {
        console.log(`🔄 Redirecting ${subdomain}.mornhub.net to ${targetPath}`);
        return NextResponse.redirect(new URL(targetPath, req.url));
      }
      
      // For any path, rewrite to the product page
      console.log(`🔄 Rewriting ${subdomain}.mornhub.net${pathname} to ${targetPath}`);
      return NextResponse.rewrite(new URL(targetPath, req.url));
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