import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const pathname = url.pathname;

  // Debug logging
  console.log('🔍 Middleware called:', { hostname, pathname, url: req.url });

  // Handle subdomain routing - be very aggressive
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
      console.log('🚀 Rewriting subdomain:', subdomain, 'to path:', subdomainMap[subdomain]);
      
      // Force rewrite to the specific product route
      const newUrl = new URL(req.url);
      newUrl.pathname = subdomainMap[subdomain];
      newUrl.search = url.search;
      
      console.log('📝 Rewriting URL from:', req.url, 'to:', newUrl.toString());
      
      // Use rewrite instead of redirect to preserve the subdomain in the URL
      return NextResponse.rewrite(newUrl);
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

  console.log('➡️ No rewrite needed, continuing...');
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