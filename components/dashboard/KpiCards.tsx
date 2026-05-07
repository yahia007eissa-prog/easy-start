'use client';

import { useTranslations } from 'next-intl';

interface KpiCardProps {
  value: string;
  labelKey: string;
  tag?: string;
  tagType?: 'green' | 'amber' | 'blue';
}

function KpiCard({ value, labelKey, tag, tagType = 'green' }: KpiCardProps) {
  const t = useTranslations('easyStart');

  const tagClasses: Record<string, string> = {
    green: 'easy-kpi-tag easy-tag-green',
    amber: 'easy-kpi-tag easy-tag-amber',
    blue: 'easy-kpi-tag easy-tag-blue',
  };

  return (
    <div className="easy-kpi">
      <div className="easy-kpi-val">{value}</div>
      <div className="easy-kpi-lbl">{t(labelKey)}</div>
      {tag && <span className={tagClasses[tagType]}>{tag}</span>}
    </div>
  );
}

export function KpiCards() {
  const t = useTranslations('easyStart');

  const kpis: KpiCardProps[] = [
    { value: '12', labelKey: 'kpiTotal', tag: t('kpiNewThisMonth', { count: 3 }), tagType: 'green' },
    { value: '3', labelKey: 'kpiInProgress', tag: t('kpiInProgressLabel'), tagType: 'amber' },
    { value: '2.4 م', labelKey: 'kpiTotalValue', tag: t('kpiCurrency'), tagType: 'blue' },
    { value: '8', labelKey: 'kpiSuppliers', tag: t('kpiActive'), tagType: 'green' },
  ];

  return (
    <div className="easy-kpi-row">
      {kpis.map((kpi, index) => (
        <KpiCard key={index} {...kpi} />
      ))}
    </div>
  );
}