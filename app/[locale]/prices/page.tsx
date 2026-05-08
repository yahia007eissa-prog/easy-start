'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';

interface RawMaterialsData {
  buildingMaterials: {
    steel:  { nameAr: string; brand: string; pricePerTon: number; unit: string };
    cement: { nameAr: string; averagePricePerTon: number; unit: string };
    sand: {
      fino:      { nameAr: string; pricePerM3: number; unit: string };
      mokhasses: { nameAr: string; pricePerM3: number; unit: string };
    };
  };
  metals: {
    gold: {
      karat24: { nameAr: string; pricePerGram: number; unit: string };
      karat21: { nameAr: string; pricePerGram: number; unit: string };
      karat18: { nameAr: string; pricePerGram: number; unit: string };
    };
    silver: {
      purity999: { nameAr: string; pricePerGram: number; unit: string };
    };
  };
  currencies: {
    USD: { nameAr: string; buyRate: number; sellRate: number; unit: string };
    EUR: { nameAr: string; buyRate: number; sellRate: number; unit: string };
    SAR: { nameAr: string; buyRate: number; sellRate: number; unit: string };
  };
}

function fmt(n: number) {
  return n.toLocaleString('ar-EG');
}

export default function PricesPage() {
  const t = useTranslations('easyStart');
  const [data, setData] = useState<RawMaterialsData | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pricing/rawMaterials')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data?.data) {
          setData(res.data.data as RawMaterialsData);
          setUpdatedAt(res.data.updatedAt ?? '');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <PageHeader
        titleKey="navMaterialPrices"
        subtitleKey="pricesSub"
        backHref="/"
      />

      <div className="easy-content">
        <div className="easy-screen active">
          {loading ? (
            <div className="easy-card text-center py-12 text-slate-400">
              جار تحميل الأسعار…
            </div>
          ) : !data ? (
            <div className="easy-card text-center py-12 text-red-400">
              تعذّر تحميل الأسعار
            </div>
          ) : (
            <>
              {/* Building Materials */}
              <div className="easy-card mb-4">
                <h2 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  🏗️ مواد البناء
                </h2>
                <div className="divide-y divide-slate-100">
                  <PriceRow name={`${data.buildingMaterials.steel.nameAr} (${data.buildingMaterials.steel.brand})`} value={fmt(data.buildingMaterials.steel.pricePerTon)} unit={data.buildingMaterials.steel.unit} />
                  <PriceRow name={data.buildingMaterials.cement.nameAr} value={fmt(data.buildingMaterials.cement.averagePricePerTon)} unit={data.buildingMaterials.cement.unit} />
                  <PriceRow name={data.buildingMaterials.sand.fino.nameAr} value={fmt(data.buildingMaterials.sand.fino.pricePerM3)} unit={data.buildingMaterials.sand.fino.unit} />
                  <PriceRow name={data.buildingMaterials.sand.mokhasses.nameAr} value={fmt(data.buildingMaterials.sand.mokhasses.pricePerM3)} unit={data.buildingMaterials.sand.mokhasses.unit} />
                </div>
              </div>

              {/* Metals */}
              <div className="easy-card mb-4">
                <h2 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  💛 المعادن
                </h2>
                <div className="divide-y divide-slate-100">
                  <PriceRow name={data.metals.gold.karat24.nameAr} value={fmt(data.metals.gold.karat24.pricePerGram)} unit={data.metals.gold.karat24.unit} />
                  <PriceRow name={data.metals.gold.karat21.nameAr} value={fmt(data.metals.gold.karat21.pricePerGram)} unit={data.metals.gold.karat21.unit} />
                  <PriceRow name={data.metals.gold.karat18.nameAr} value={fmt(data.metals.gold.karat18.pricePerGram)} unit={data.metals.gold.karat18.unit} />
                  <PriceRow name={data.metals.silver.purity999.nameAr} value={fmt(data.metals.silver.purity999.pricePerGram)} unit={data.metals.silver.purity999.unit} />
                </div>
              </div>

              {/* Currencies */}
              <div className="easy-card mb-4">
                <h2 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  💱 أسعار العملات
                </h2>
                <div className="divide-y divide-slate-100">
                  <CurrencyRow name={data.currencies.USD.nameAr} buy={fmt(data.currencies.USD.buyRate)} sell={fmt(data.currencies.USD.sellRate)} unit={data.currencies.USD.unit} />
                  <CurrencyRow name={data.currencies.EUR.nameAr} buy={fmt(data.currencies.EUR.buyRate)} sell={fmt(data.currencies.EUR.sellRate)} unit={data.currencies.EUR.unit} />
                  <CurrencyRow name={data.currencies.SAR.nameAr} buy={fmt(data.currencies.SAR.buyRate)} sell={fmt(data.currencies.SAR.sellRate)} unit={data.currencies.SAR.unit} />
                </div>
              </div>

              {updatedAt && (
                <p className="text-xs text-slate-400 text-center mt-2">
                  آخر تحديث: {new Date(updatedAt).toLocaleDateString('ar-EG')} — المصدر: اليوم
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PriceRow({ name, value, unit }: { name: string; value: string; unit: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 text-sm">
      <span className="text-slate-600">{name}</span>
      <span className="font-semibold text-slate-800">{value} <span className="text-xs text-slate-400 font-normal">{unit}</span></span>
    </div>
  );
}

function CurrencyRow({ name, buy, sell, unit }: { name: string; buy: string; sell: string; unit: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 text-sm">
      <span className="text-slate-600">{name}</span>
      <span className="font-semibold text-slate-800 flex gap-3">
        <span>شراء: {buy}</span>
        <span>بيع: {sell}</span>
        <span className="text-xs text-slate-400 font-normal self-center">{unit}</span>
      </span>
    </div>
  );
}
