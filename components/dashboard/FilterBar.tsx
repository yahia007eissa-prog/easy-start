'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import type { ProjectType } from '@/lib/types/project';

type FilterOption = 'all' | ProjectType;

interface FilterBarProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  counts: Record<FilterOption, number>;
}

const filterKeys = ['all', 'residential', 'commercial', 'industrial', 'mixed-use'] as const;

export function FilterBar({ activeFilter, onFilterChange, counts }: FilterBarProps) {
  const t = useTranslations('filters');

  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
      {filterKeys.map((key) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`
            px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap
            transition-all duration-200
            ${activeFilter === key
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
            }
          `}
        >
          {t(key === 'all' ? 'all' : key === 'mixed-use' ? 'mixedUse' : key)}
          <span className={`
            ms-2 me-0 px-2 py-0.5 text-xs rounded-full
            ${activeFilter === key
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 text-slate-500'
            }
          `}>
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  );
}

// Re-export the type for use in other components
export type { FilterOption };