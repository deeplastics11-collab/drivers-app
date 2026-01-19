import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'drivers_app_session';

export async function createSession(user) {
    const sessionData = JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
    });

    // In a real app, we would sign this or store the session in the DB.
    // For this demo, we store the user info in a cookie (base64 encoded for simple obfuscation).
    const encodedSession = Buffer.from(sessionData).toString('base64');

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, encodedSession, {
        httpOnly: true,
        secure: false, // process.env.NODE_ENV === 'production', // Disabled for localhost demo
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) return null;

    try {
        const sessionData = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
        return JSON.parse(sessionData);
    } catch (e) {
        return null;
    }
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}
