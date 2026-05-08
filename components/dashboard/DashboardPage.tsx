"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { KpiCards } from "./KpiCards";
import { ProjectList } from "./ProjectList";
import { PriceTicker, type PriceItem } from "./PriceTicker";
import Link from "next/link";

type ProjectStatus = "done" | "prog" | "new";
type ProjectIcon = "hosp" | "res" | "com" | "agr";

interface Project {
  id: string;
  nameKey: string;
  metaKey: string;
  costKey: string;
  status: ProjectStatus;
  icon: ProjectIcon;
}

// Sample data - these will eventually come from React Query
const sampleProjects: Project[] = [
  {
    id: "1",
    nameKey: "sampleProjects.project1.name",
    metaKey: "sampleProjects.project1.meta",
    costKey: "sampleProjects.project1.cost",
    status: "done",
    icon: "hosp",
  },
  {
    id: "2",
    nameKey: "sampleProjects.project2.name",
    metaKey: "sampleProjects.project2.meta",
    costKey: "sampleProjects.project2.cost",
    status: "prog",
    icon: "res",
  },
  {
    id: "3",
    nameKey: "sampleProjects.project3.name",
    metaKey: "sampleProjects.project3.meta",
    costKey: "sampleProjects.project3.cost",
    status: "new",
    icon: "com",
  },
  {
    id: "4",
    nameKey: "sampleProjects.project4.name",
    metaKey: "sampleProjects.project4.meta",
    costKey: "sampleProjects.project4.cost",
    status: "done",
    icon: "agr",
  },
];


const PlusIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

export function DashboardPage() {
  const t = useTranslations("easyStart");
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [prices, setPrices] = useState<PriceItem[]>([]);

  useEffect(() => {
    fetch('/api/pricing/rawMaterials')
      .then(r => r.json())
      .then(res => {
        if (!res.success || !res.data?.data) return;
        const d = res.data.data;
        const fmt = (n: number) => n.toLocaleString(isAr ? 'ar-EG' : 'en-US');
        const egp = isAr ? 'جنيه' : 'EGP';
        setPrices([
          {
            name: isAr ? `${d.buildingMaterials.steel.nameAr} (${d.buildingMaterials.steel.brand})` : `Steel (Ez)`,
            unit: isAr ? 'جنيه/طن' : `${egp}/ton`,
            value: fmt(d.buildingMaterials.steel.pricePerTon), change: 0,
          },
          {
            name: isAr ? d.buildingMaterials.cement.nameAr : 'Cement',
            unit: isAr ? 'جنيه/طن' : `${egp}/ton`,
            value: fmt(d.buildingMaterials.cement.averagePricePerTon), change: 0,
          },
          {
            name: isAr ? d.buildingMaterials.sand.fino.nameAr : 'Fine Sand',
            unit: isAr ? 'جنيه/م³' : `${egp}/m³`,
            value: fmt(d.buildingMaterials.sand.fino.pricePerM3), change: 0,
          },
          {
            name: isAr ? d.metals.gold.karat21.nameAr : 'Gold 21K',
            unit: isAr ? 'جنيه/جرام' : `${egp}/g`,
            value: fmt(d.metals.gold.karat21.pricePerGram), change: 0,
          },
          {
            name: isAr ? d.currencies.USD.nameAr : 'USD',
            unit: isAr ? 'جنيه' : egp,
            value: fmt(d.currencies.USD.sellRate), change: 0,
          },
        ]);
      });
  }, [isAr]);

  return (
    <div className="flex flex-col">
      <div className="easy-topbar">
        <div className="flex items-center gap-3">
          <div>
            <div className="easy-page-title">{t("dashboardTitle")}</div>
            <div className="easy-page-sub">
              {t("dashboardSub", { count: 3 })}
            </div>
          </div>
        </div>
        <div className="easy-topbar-actions">
          <button className="easy-btn-secondary" onClick={() => {}}>
            {t("exportPdf")}
          </button>
          <Link
            href="/valuation"
            className="easy-btn-secondary flex items-center gap-2"
          >
            ⚖️ {t("navValuation")}
          </Link>
          <Link
            href="/new-study"
            className="easy-btn-primary flex items-center gap-2"
          >
            <PlusIcon />
            {t("navNewStudy")}
          </Link>
        </div>
      </div>

      <div className="easy-content">
        <div className="easy-screen active">
          {/* KPI Cards */}
          <KpiCards />

          {/* Recent Projects */}
          <ProjectList projects={sampleProjects} />

          {/* Material Prices */}
          {prices.length > 0 && <PriceTicker prices={prices} />}
        </div>
      </div>
    </div>
  );
}
