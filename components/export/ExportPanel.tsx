'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { generateEstimateDocument, generateROIDocument, generateTakeoffDocument } from '@/lib/docx';
import type { Project } from '@/lib/types/project';
import { useTranslations } from 'next-intl';

interface ExportPanelProps {
  project: Project;
}

type ExportType = 'estimate' | 'roi' | 'takeoff';

export function ExportPanel({ project }: ExportPanelProps) {
  const t = useTranslations('export');
  const [exporting, setExporting] = useState<ExportType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (type: ExportType) => {
    setExporting(type);
    setError(null);

    try {
      switch (type) {
        case 'estimate':
          await generateEstimateDocument(project);
          break;
        case 'roi':
          await generateROIDocument(project);
          break;
        case 'takeoff':
          await generateTakeoffDocument(project);
          break;
      }
    } catch (err) {
      setError(t('error'));
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  const exportButtons = [
    {
      type: 'estimate' as const,
      label: t('costEstimate'),
      description: t('costEstimateDesc'),
      icon: '📊',
    },
    {
      type: 'roi' as const,
      label: t('roiAnalysis'),
      description: t('roiAnalysisDesc'),
      icon: '📈',
    },
    {
      type: 'takeoff' as const,
      label: t('materialTakeoff'),
      description: t('materialTakeoffDesc'),
      icon: '📋',
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{t('title')}</h3>
      <p className="text-sm text-slate-500 mb-6">
        {t('subtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exportButtons.map((btn) => (
          <Button
            key={btn.type}
            variant="secondary"
            onClick={() => handleExport(btn.type)}
            disabled={exporting !== null}
            className="h-auto flex-col py-4 gap-2"
          >
            {exporting === btn.type ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">{t('generating')}</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span className="font-medium">{btn.label}</span>
                <span className="text-xs text-slate-500 font-normal">{btn.description}</span>
              </>
            )}
          </Button>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-sm text-rose-500">{error}</p>
      )}
    </Card>
  );
}