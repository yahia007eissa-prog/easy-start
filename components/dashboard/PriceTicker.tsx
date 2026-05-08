'use client';

import { useTranslations } from 'next-intl';

export interface PriceItem {
  nameKey?: string;
  unitKey?: string;
  name?: string;   // direct label (overrides nameKey)
  unit?: string;   // direct unit  (overrides unitKey)
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
              <span className="easy-ticker-name">
                {item.name ?? (item.nameKey ? t(item.nameKey) : '')}
              </span>
              <span className="easy-ticker-val">
                {item.value}{' '}
                <span style={{ fontSize: '10px', opacity: 0.7 }}>
                  {item.unit ?? (item.unitKey ? t(item.unitKey) : '')}
                </span>
              </span>
              {item.change !== 0 && (
                <span className={item.change > 0 ? 'easy-ticker-up' : 'easy-ticker-down'}>
                  {item.change > 0 ? '▲' : '▼'} {Math.abs(item.change)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
