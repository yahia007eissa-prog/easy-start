'use client';

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { PricingEditor } from '@/components/pricing/PricingEditor';

export default function PricingPage() {
  const t = useTranslations('easyStart');

  return (
    <div className="w-full max-w-4xl">
      <PageHeader
        titleKey="pricingTitle"
        subtitleKey="pricingSubtitle"
        backHref="/"
      />

      <div className="easy-content">
        <div className="easy-screen active">
          <div className="easy-card">
            <div className="mb-4">
              <p className="text-slate-600">
                {t('pricingDescription')}
              </p>
            </div>
            <PricingEditor className="h-[500px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
