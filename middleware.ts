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
      // With localePrefix:'as-needed', English URLs have no prefix (/settings/...)
      // Arabic URLs have /ar/ prefix. Detect which is which.
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      const detectedLocale = localeMatch?.[1];
      const KNOWN_LOCALES = ['ar', 'en'];
      const isArPrefix = detectedLocale && KNOWN_LOCALES.includes(detectedLocale) && detectedLocale !== 'en';
      const loginPath = isArPrefix ? `/ar/admin/login` : `/admin/login`;
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = intlMiddleware(request);
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
