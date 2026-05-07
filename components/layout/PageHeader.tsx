'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface PageHeaderProps {
  titleKey: string;
  subtitleKey?: string;
  backHref?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ titleKey, subtitleKey, backHref, actions }: PageHeaderProps) {
  const t = useTranslations('easyStart');

  return (
    <div className="easy-topbar">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link href={backHref} className="easy-back-btn">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
          </Link>
        )}
        <div>
          <div className="easy-page-title">{t(titleKey)}</div>
          {subtitleKey && <div className="easy-page-sub">{t(subtitleKey)}</div>}
        </div>
      </div>
      {actions && <div className="easy-topbar-actions">{actions}</div>}
    </div>
  );
}
