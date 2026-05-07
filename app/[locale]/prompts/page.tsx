import { getTranslations } from 'next-intl/server';
import { PromptEditor } from '@/components/prompts/PromptEditor';

export default async function PromptsPage() {
  const t = await getTranslations('easyStart');

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">{t('prompts.title')}</h1>
          <p className="text-slate-600 mt-1">
            {t('prompts.subtitle')}
          </p>
        </div>

        {/* Editor Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <PromptEditor className="h-[600px]" />
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>{t('prompts.note')}</strong> {t('prompts.noteText')}
          </p>
        </div>
      </div>
    </div>
  );
}