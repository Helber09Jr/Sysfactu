import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Modo demo: el middleware solo redirige la raíz al login
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/']
}
