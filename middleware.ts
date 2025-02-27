import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session/utils'
import { cookies } from 'next/headers'
import { getUser } from './app/lib/session/api'
 

// 1. Specify public routes
const publicRoutes = ['/auth/login', '/auth/signup', '/']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is public
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)
 
  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  // 4. Redirect to /login if the user is not authenticated
  if (!isPublicRoute && !(await getUser())) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
  }
 
  // 5. Redirect to / if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/')
  ) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Ref: Next.js Authorization Document
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}