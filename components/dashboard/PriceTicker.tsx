'use client';

import { useTranslations } from 'next-intl';

interface PriceItem {
  nameKey: string;
  unitKey: string;
  value: string;
  change: number;
}

interface PriceTickerProps {
  prices: PriceItem[];
}

export function PriceTicker({ prices }: PriceTickerProps) {
  const t = useTranslations('easyStart');

  return (
    <>
      <div className="easy-section-head">
        <div className="easy-section-title">{t('materialPrices')}</div>
        <div className="easy-section-link">{t('refresh')}</div>
      </div>

      <div className="easy-price-ticker">
        <div className="easy-ticker-row">
          {prices.map((item, index) => (
            <div key={index} className="easy-ticker-item">
              <span className="easy-ticker-name">{t(item.nameKey)}</span>
              <span className="easy-ticker-val">{item.value} {t(item.unitKey)}</span>
              <span className={item.change > 0 ? 'easy-ticker-up' : 'easy-ticker-down'}>
                {item.change > 0 ? '▲' : '▼'} {Math.abs(item.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}