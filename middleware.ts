import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_SEGMENT = '/settings/';
const COOKIE_NAME = 'admin_session';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.includes(PROTECTED_SEGMENT)) {
    const secret  = process.env.ADMIN_SESSION_SECRET ?? '';
    const session = request.cookies.get(COOKIE_NAME)?.value ?? '';

    if (!secret || session !== secret) {
      // Extract locale prefix (e.g. /ar/settings/... → ar)
      const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
      const locale = localeMatch?.[1] ?? 'ar';
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
