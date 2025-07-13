import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Domain mapping configuration
  const domainMap = {
    'rent.mornhub.net': '/rent',
    'job.mornhub.net': '/job', 
    'social.mornhub.net': '/social',
    'deepfake-detector.mornhub.net': '/deepfake-detector',
    'accelerator.mornhub.net': '/accelerator'
  };

  // Handle exact domain matches first
  if (domainMap[hostname]) {
    url.pathname = `${domainMap[hostname]}${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Handle *.mornhub.net subdomains
  if (hostname.endsWith('.mornhub.net')) {
    const subdomain = hostname.split('.')[0];

    // Don't rewrite for the main/root domain
    if (
      subdomain !== 'www' &&
      subdomain !== 'mornhub' // in case someone uses mornhub.net directly
    ) {
      // Map subdomain to path
      const pathMap = {
        'rent': '/rent',
        'job': '/job',
        'social': '/social',
        'deepfake-detector': '/deepfake-detector',
        'accelerator': '/accelerator'
      };

      if (pathMap[subdomain]) {
        url.pathname = `${pathMap[subdomain]}${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  // Handle root domain (mornhub.net) - serve main app
  if (hostname === 'mornhub.net' || hostname === 'www.mornhub.net') {
    // If accessing sub-app paths directly, allow them
    if (url.pathname.match(/^\/(rent|job|social|deepfake-detector|accelerator)/)) {
      return NextResponse.next();
    }
    
    // For root path, serve main app
    if (url.pathname === '/') {
      return NextResponse.next();
    }
  }

  // Default: continue as normal
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