'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';

type ProjectCategory = 'realEstate' | 'medical' | 'agricultural' | 'industrial';

interface PromptInfo {
  category: ProjectCategory;
  name: string;
  nameAr: string;
  promptLength: number;
  updatedAt: string;
}

const CATEGORY_ICONS: Record<ProjectCategory, string> = {
  realEstate: '🏢',
  medical: '🏥',
  agricultural: '🌾',
  industrial: '🏭',
};

interface PromptEditorProps {
  className?: string;
}

export function PromptEditor({ className = '' }: PromptEditorProps) {
  const t = useTranslations('easyStart');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [activeTab, setActiveTab] = useState<ProjectCategory>('realEstate');
  const [prompts, setPrompts] = useState<PromptInfo[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch all prompts summary
  useEffect(() => {
    fetchPromptsList();
  }, []);

  // Fetch full prompt when tab changes
  useEffect(() => {
    if (activeTab) {
      fetchPrompt(activeTab);
    }
  }, [activeTab]);

  const fetchPromptsList = async () => {
    try {
      const res = await fetch('/api/prompts');
      const data = await res.json();
      if (data.success) {
        setPrompts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrompt = async (category: ProjectCategory) => {
    try {
      const res = await fetch(`/api/prompts/${category}`);
      const data = await res.json();
      if (data.success) {
        setCurrentPrompt(data.data.prompt);
      }
    } catch (error) {
      console.error('Failed to fetch prompt:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch(`/api/prompts/${activeTab}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      const data = await res.json();

      if (data.success) {
        setSaved(true);
        // Update prompts list
        fetchPromptsList();
        // Hide success message after 3s
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.error || t('prompts.failedToSave'));
      }
    } catch (error) {
      console.error('Failed to save prompt:', error);
      alert(t('prompts.failedToSave'));
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getCategoryLabel = (category: ProjectCategory) => {
    const info = prompts.find(p => p.category === category);
    return isRTL ? info?.nameAr : info?.name;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-4 overflow-x-auto">
        {prompts.map((prompt) => (
          <button
            key={prompt.category}
            onClick={() => setActiveTab(prompt.category as ProjectCategory)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === prompt.category
                ? 'border-amber-500 text-amber-600 bg-amber-50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>{CATEGORY_ICONS[prompt.category as ProjectCategory]}</span>
            <span>{getCategoryLabel(prompt.category as ProjectCategory) || prompt.category}</span>
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-500">
            {t('prompts.characters', { count: currentPrompt.length.toLocaleString() })}
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-green-600 font-medium">
                {t('prompts.saved')}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('prompts.saving')}
                </>
              ) : (
                t('prompts.saveChanges')
              )}
            </button>
          </div>
        </div>

        <textarea
          value={currentPrompt}
          onChange={(e) => {
            setCurrentPrompt(e.target.value);
            setSaved(false);
          }}
          className="flex-1 w-full p-4 border border-slate-200 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder={t('prompts.promptPlaceholder')}
          spellCheck={false}
          dir="ltr"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Status bar */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
        <span>
          {prompts.find(p => p.category === activeTab)?.updatedAt && (
            <>{t('prompts.lastUpdated', { date: formatDate(prompts.find(p => p.category === activeTab)!.updatedAt) })}</>
          )}
        </span>
        <span>
          {getCategoryLabel(activeTab)}
        </span>
      </div>
    </div>
  );
}