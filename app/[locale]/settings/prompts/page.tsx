'use client';

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { PromptEditor } from '@/components/prompts/PromptEditor';
import { AdminPageBar } from '@/components/admin/LogoutButton';

export default function PromptsPage() {
  const t = useTranslations('easyStart');

  return (
    <div className="w-full max-w-4xl">
      <AdminPageBar />
      <PageHeader
        titleKey="navSystemPrompts"
        subtitleKey="promptsSub"
        backHref="/"
      />

      <div className="easy-content">
        <div className="easy-screen active">
          <div className="easy-card">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              {t('promptsConfigTitle')}
            </h2>
            <p className="text-slate-600 mb-6">
              {t('promptsConfigDescription')}
            </p>
            <PromptEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
