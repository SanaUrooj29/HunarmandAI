import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Admin Portal Middleware
 *
 * In production this would verify a Supabase JWT (admin role)
 * from the HTTP-only cookie and redirect to /login if absent.
 *
 * For the frontend-only implementation, we pass all requests through.
 * Replace the body below with real Supabase auth verification.
 */
export function middleware(request: NextRequest) {
  // --- Production auth check (example) ---
  // const token = request.cookies.get('sb-access-token')?.value;
  // if (!token) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  // const payload = await verifyJWT(token); // Supabase JWT
  // if (payload.role !== 'admin') {
  //   return NextResponse.redirect(new URL('/unauthorized', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login|unauthorized).*)',
  ],
};
