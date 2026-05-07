'use client';

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';

export default function ProjectDetailPage() {
  const t = useTranslations('easyStart');

  return (
    <div className="w-full max-w-4xl">
      <PageHeader
        titleKey="projectDetails"
        subtitleKey="projectDetailsSub"
        backHref="/projects"
      />

      <div className="easy-content">
        <div className="easy-screen active">
          <div className="easy-card">
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                {t('projectDetailsTitle')}
              </h2>
              <p className="text-slate-600">
                {t('projectDetailsDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
