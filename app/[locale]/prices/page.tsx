'use client';

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { PriceTicker } from '@/components/dashboard/PriceTicker';

const samplePrices = [
  { nameKey: 'prices.rebar', unitKey: 'prices.rebarUnit', value: '28,500', change: 2.1 },
  { nameKey: 'prices.cement', unitKey: 'prices.cementUnit', value: '3,200', change: -0.5 },
  { nameKey: 'prices.brick', unitKey: 'prices.brickUnit', value: '6,800', change: 1.3 },
  { nameKey: 'prices.sand', unitKey: 'prices.sandUnit', value: '420', change: -0.2 },
  { nameKey: 'prices.dollar', unitKey: 'prices.dollarUnit', value: '48.75', change: 0.3 },
];

export default function PricesPage() {
  const t = useTranslations('easyStart');

  return (
    <div className="w-full max-w-4xl">
      <PageHeader
        titleKey="navMaterialPrices"
        subtitleKey="pricesSub"
        backHref="/"
      />

      <div className="easy-content">
        <div className="easy-screen active">
          <div className="easy-card">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💰</div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                {t('liveMaterialPrices')}
              </h2>
              <PriceTicker prices={samplePrices} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
