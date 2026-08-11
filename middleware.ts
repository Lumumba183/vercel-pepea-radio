import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/news',
  '/news/(.*)',
  '/article/(.*)',
  '/listen',
  '/tv',
  '/schedule',
  '/advertise',
  '/book-space',
  '/report',
  '/about',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)',
  '/api/debug/(.*)',
  '/api/articles',
  '/api/articles/(.*)',
  '/api/brief',
  '/api/settings',
  '/api/analytics/track',
  '/api/analytics',
  '/api/schedule',
  '/api/reports',
  '/api/advertisements',
  '/api/advertisements/(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
