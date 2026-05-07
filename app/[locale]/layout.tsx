import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { routing } from '@/i18n/routing';
import '../globals.css';
import { ProjectsProvider } from '@/lib/hooks/useServerActions';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AppShell } from '@/components/layout/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Real Estate Builder',
  description: 'Manage your real estate development projects',
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Check if current path is chat or /prompts (standalone full-screen layout)
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || headersList.get('referer') || '';
  const isStandalonePage = pathname.includes('/chat') || pathname === `/${locale}/prompts` || pathname === `/${locale}/prompts/` || pathname === '/prompts' || pathname === '/prompts/';

  return (
    <html lang={locale} dir={dir}>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ProjectsProvider>
              {isStandalonePage ? (
                children
              ) : (
                <AppShell>
                  <div
                    className="min-h-screen bg-slate-100 flex items-center justify-center p-4"
                    dir={dir}
                  >
                    {children}
                  </div>
                </AppShell>
              )}
            </ProjectsProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
