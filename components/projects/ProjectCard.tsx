'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Maximize2, Home, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProjectTypeBadge, StatusBadge } from '@/components/ui/Badge';
import type { Project } from '@/lib/types/project';
import { formatCurrency, formatSqft } from '@/lib/utils/formatters';
import { Link } from '@/i18n/navigation';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const tBadges = useTranslations('badges');
  const tUnits = useTranslations('units');
  const tDashboard = useTranslations('dashboard');
  const tCommon = useTranslations('common');

  // Helper function to normalize project type for badge lookup
  const getBadgeKey = (type: string): string => {
    const normalized = type.toLowerCase().replace('_', '-');
    // Map to the correct badge key
    const mapping: Record<string, string> = {
      'residential': 'residential',
      'commercial': 'commercial',
      'industrial': 'industrial',
      'mixed-use': 'mixedUse',
    };
    return mapping[normalized] || normalized;
  };

  const getProjectMetrics = () => {
    switch (project.type) {
      case 'residential':
        return project.residentialData ? (
          <>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Home className="w-4 h-4" />
              <span>{project.residentialData.unitCount} {tUnits('units')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Maximize2 className="w-4 h-4" />
              <span>{formatSqft(project.residentialData.totalSqft)}</span>
            </div>
          </>
        ) : null;

      case 'commercial':
        return project.commercialData ? (
          <>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Maximize2 className="w-4 h-4" />
              <span>{formatSqft(project.commercialData.totalSqft)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Home className="w-4 h-4" />
              <span>{project.commercialData.floorCount} {tUnits('floors')}</span>
            </div>
          </>
        ) : null;

      case 'industrial':
        return project.industrialData ? (
          <>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Maximize2 className="w-4 h-4" />
              <span>{formatSqft(project.industrialData.totalSqft)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Home className="w-4 h-4" />
              <span>{project.industrialData.loadingDocks} {tUnits('docks')}</span>
            </div>
          </>
        ) : null;

      case 'mixed-use':
        return project.mixedUseData ? (
          <>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Home className="w-4 h-4" />
              <span>{project.mixedUseData.residentialUnits} {tUnits('units')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Maximize2 className="w-4 h-4" />
              <span>{formatSqft(project.mixedUseData.commercialSqft + project.mixedUseData.retailSqft + project.mixedUseData.officeSqft)}</span>
            </div>
          </>
        ) : null;

      default:
        return null;
    }
  };

  const estimatedCost = project.calculations?.costEstimation?.grandTotal ?? 0;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card hover padding="none" className="overflow-hidden group">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <ProjectTypeBadge type={project.type} label={tBadges(getBadgeKey(project.type))} />
              <StatusBadge status={project.status} label={tBadges(project.status)} />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
            {project.name}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{project.location.city}, {project.location.state}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            {getProjectMetrics()}
          </div>

          {estimatedCost > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{tDashboard('estCost')}</span>
                <span className="text-lg font-semibold text-slate-900">
                  {formatCurrency(estimatedCost)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-600 group-hover:text-amber-600 transition-colors">
            {tCommon('viewDetails')}
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </div>
      </Card>
    </Link>
  );
}