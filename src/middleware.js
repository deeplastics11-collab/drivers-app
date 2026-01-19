import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Check for session cookie
    const sessionCookie = request.cookies.get('drivers_app_session');
    let user = null;

    if (sessionCookie) {
        try {
            const sessionData = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
            user = JSON.parse(sessionData);
        } catch (e) {
            // Invalid session
        }
    }

    // Protect Admin Routes
    if (path.startsWith('/admin') && path !== '/admin/login') {
        if (!user || user.role !== 'admin') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Protect Driver Routes
    if (path.startsWith('/driver') && path !== '/driver/login') {
        if (!user || user.role !== 'driver') {
            return NextResponse.redirect(new URL('/driver/login', request.url));
        }
    }

    // Redirect authenticated users away from login pages
    if (user) {
        if (path === '/admin/login' && user.role === 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        if (path === '/driver/login' && user.role === 'driver') {
            return NextResponse.redirect(new URL('/driver/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/driver/:path*'],
};
