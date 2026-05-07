'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Globe } from 'lucide-react';

const localeNames: Record<string, string> = {
  en: 'English',
  ar: 'العربية',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = locale === 'ar';

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative">
      <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? 'right-2.5' : 'left-2.5'}`}>
        <Globe className="w-4 h-4 text-slate-400" />
      </div>
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className={`appearance-none bg-white py-2 pr-8 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer hover:border-slate-300 transition-colors ${isRTL ? 'pl-8 text-right' : 'pl-8 text-left'}`}
      >
        {['en', 'ar'].map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
      <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? 'left-2.5' : 'right-2.5'}`}>
        <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
