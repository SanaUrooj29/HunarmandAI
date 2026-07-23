import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const PUBLIC_PATHS = [
  '/onboarding',
  '/onboarding/language',
  '/onboarding/phone',
  '/onboarding/otp',
  '/onboarding/profile-setup',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static assets
  ) {
    return NextResponse.next()
  }

  const isPublicPath = PUBLIC_PATHS.some(p => pathname.startsWith(p))

  // Read auth cookie (set by frontend after OTP verification on this domain)
  const authToken = request.cookies.get('hunarmand_auth')?.value
  const hasCompletedOnboarding = request.cookies.get('hunarmand_onboarded')?.value

  // Not authenticated → send to onboarding (unless already there)
  if (!authToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Authenticated but onboarding incomplete → finish setup
  if (authToken && !hasCompletedOnboarding && !isPublicPath) {
    return NextResponse.redirect(new URL('/onboarding/profile-setup', request.url))
  }

  // Already authenticated → skip onboarding screens
  if (authToken && hasCompletedOnboarding && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, manifest.json, icons
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon).*)',
  ],
}
