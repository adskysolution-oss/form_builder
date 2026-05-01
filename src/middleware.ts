import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'supersecretjwtkey'
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Public paths
  if (
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/' ||
    pathname.startsWith('/form/') // Public forms
  ) {
    return NextResponse.next();
  }

  // If no token and trying to access protected route
  if (!token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Check Admin routes
    if (pathname.startsWith('/admin')) {
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Check User Dashboard
    if (pathname.startsWith('/dashboard')) {
      if (payload.role !== 'USER' && payload.role !== 'ADMIN' && payload.role !== 'RESELLER') {
         return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
