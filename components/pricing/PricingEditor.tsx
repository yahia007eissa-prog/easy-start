'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';

type PricingCategory = 'realEstate' | 'medical' | 'agricultural' | 'industrial' | 'global';

interface PricingInfo {
  category: PricingCategory;
  name: string;
  nameAr: string;
  dataSize: number;
  updatedAt: string;
}

const CATEGORY_ICONS: Record<PricingCategory, string> = {
  realEstate: '🏢',
  medical: '🏥',
  agricultural: '🌾',
  industrial: '🏭',
  global: '⚙️',
};

interface PricingEditorProps {
  className?: string;
}

export function PricingEditor({ className = '' }: PricingEditorProps) {
  const t = useTranslations('easyStart');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [activeTab, setActiveTab] = useState<PricingCategory>('realEstate');
  const [pricingList, setPricingList] = useState<PricingInfo[]>([]);
  const [currentData, setCurrentData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Fetch all pricing summary
  useEffect(() => {
    fetchPricingList();
  }, []);

  // Fetch full data when tab changes
  useEffect(() => {
    if (activeTab) {
      fetchPricing(activeTab);
    }
  }, [activeTab]);

  const fetchPricingList = async () => {
    try {
      const res = await fetch('/api/pricing');
      const data = await res.json();
      if (data.success) {
        setPricingList(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch pricing list:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricing = async (category: PricingCategory) => {
    try {
      const res = await fetch(`/api/pricing/${category}`);
      const data = await res.json();
      if (data.success) {
        setCurrentData(JSON.stringify(data.data.data, null, 2));
        setJsonError(null);
      }
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setJsonError(null);

    // Validate JSON
    try {
      const parsed = JSON.parse(currentData);
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Data must be an object');
      }
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : 'Invalid JSON');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/pricing/${activeTab}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: JSON.parse(currentData) }),
      });

      const data = await res.json();

      if (data.success) {
        setSaved(true);
        fetchPricingList();
        setTimeout(() => setSaved(false), 3000);
      } else {
        setJsonError(data.error || t('pricing.failedToSave'));
      }
    } catch (error) {
      console.error('Failed to save pricing:', error);
      setJsonError(t('pricing.failedToSave'));
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([currentData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-pricing.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        JSON.parse(content);
        setCurrentData(content);
        setJsonError(null);
      } catch {
        setJsonError('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm(isRTL ? 'هل تريد إعادة تعيين البيانات الافتراضية؟' : 'Do you want to reset to default data?')) {
      fetch(`/api/pricing/${activeTab}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCurrentData(JSON.stringify(data.data.data, null, 2));
            setJsonError(null);
          }
        });
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

  const getCategoryLabel = (category: PricingCategory) => {
    const info = pricingList.find(p => p.category === category);
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
        {pricingList.map((item) => (
          <button
            key={item.category}
            onClick={() => setActiveTab(item.category as PricingCategory)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === item.category
                ? 'border-amber-500 text-amber-600 bg-amber-50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>{CATEGORY_ICONS[item.category as PricingCategory]}</span>
            <span>{getCategoryLabel(item.category as PricingCategory) || item.category}</span>
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              {currentData.length.toLocaleString()} chars
            </div>
            {jsonError && (
              <div className="text-sm text-red-500 flex items-center gap-1">
                <span>⚠️</span>
                <span>{jsonError}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-green-600 font-medium">
                ✓ {t('pricing.saved')}
              </span>
            )}
            <button
              onClick={handleExport}
              className="px-3 py-2 text-sm border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t('pricing.export')}
            </button>
            <label className="px-3 py-2 text-sm border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
              {t('pricing.import')}
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleReset}
              className="px-3 py-2 text-sm border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t('pricing.reset')}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !!jsonError}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('pricing.saving')}
                </>
              ) : (
                t('pricing.saveChanges')
              )}
            </button>
          </div>
        </div>

        <textarea
          value={currentData}
          onChange={(e) => {
            setCurrentData(e.target.value);
            setSaved(false);
            setJsonError(null);
            try {
              JSON.parse(e.target.value);
            } catch (e) {
              setJsonError(e instanceof Error ? e.message : 'Invalid JSON');
            }
          }}
          className={`flex-1 w-full p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
            jsonError ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder='{\n  "key": "value"\n}'
          spellCheck={false}
          dir="ltr"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Status bar */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
        <span>
          {pricingList.find(p => p.category === activeTab)?.updatedAt && (
            <>{t('pricing.lastUpdated', { date: formatDate(pricingList.find(p => p.category === activeTab)!.updatedAt) })}</>
          )}
        </span>
        <span>
          {getCategoryLabel(activeTab)}
        </span>
      </div>
    </div>
  );
}
