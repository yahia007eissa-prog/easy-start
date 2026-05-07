'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Search } from 'lucide-react';

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddProject: () => void;
}

export function DashboardHeader({
  searchQuery,
  onSearchChange,
  onAddProject
}: DashboardHeaderProps) {
  const t = useTranslations('dashboard');

  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:right-3 rtl:left-auto" />
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 rtl:pr-10 rtl:pl-4"
          />
        </div>
      </div>
      <Button onClick={onAddProject}>
        <Plus className="w-4 h-4 me-2 rtl:me-0 rtl:ms-2" />
        {t('newProject')}
      </Button>
    </div>
  );
}