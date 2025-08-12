import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware is currently not doing much, but can be used later.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
