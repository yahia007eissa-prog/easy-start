'use client';

import { useTranslations } from 'next-intl';

interface IndustrialFormProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const RequiredBadge = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-required">{label}</span>
);
const OptionalBadge = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-optional">{label}</span>
);

const BASEMENT_OPTIONS = ['none', 'one', 'two', 'three', 'four'] as const;
const BASEMENT_LABEL_KEY: Record<typeof BASEMENT_OPTIONS[number], string> = {
  none: 'noBasement', one: 'oneBasement', two: 'twoBasement', three: 'threeBasement', four: 'fourBasement',
};
const BASEMENT_EXTRA_ITEMS = ['soilReplacement', 'shearWall', 'piles'] as const;

function parseBasementExtras(raw: string | undefined): string[] {
  if (!raw) return [];
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; }
  catch { return []; }
}

export function IndustrialForm({ formData, onChange }: IndustrialFormProps) {
  const t = useTranslations('easyStart');

  const update = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  return (
    <>
      {/* نشاط المصنع — الحقل المميز للصناعي */}
      <div className="easy-form-row">
        <div className="easy-form-group" style={{ flex: 1 }}>
          <label className="easy-form-label">
            {t('indFactoryActivity')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('indFactoryActivityPh')}
            value={formData.factoryActivity || ''}
            onChange={e => update('factoryActivity', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('finishingLevel')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.finishingLevel || 'normal'}
            onChange={e => update('finishingLevel', e.target.value)}
          >
            <option value="none">{t('finishingNone')}</option>
            <option value="normal">{t('finishingNormal')}</option>
            <option value="medium">{t('finishingMedium')}</option>
            <option value="premium">{t('finishingPremium')}</option>
          </select>
        </div>
      </div>

      {/* مساحة الأرض + سعر المتر */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('landArea')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('landAreaPlaceholder')}
            value={formData.landArea || ''}
            onChange={e => update('landArea', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('indLandPrice')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('indLandPricePh')}
            value={formData.landPrice || ''}
            onChange={e => update('landPrice', e.target.value)}
          />
        </div>
      </div>

      {/* مساحة البناء + عدد الأدوار */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('constructionArea')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('constructionAreaPlaceholder')}
            value={formData.constructionArea || ''}
            onChange={e => update('constructionArea', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('floorsCount')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('floorsPlaceholder')}
            value={formData.floorsCount || ''}
            onChange={e => update('floorsCount', e.target.value)}
          />
        </div>
      </div>

      {/* البدروم */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('basement')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.basement || 'none'}
            onChange={e => update('basement', e.target.value)}
          >
            {BASEMENT_OPTIONS.map(v => (
              <option key={v} value={v}>{t(BASEMENT_LABEL_KEY[v])}</option>
            ))}
          </select>
        </div>
        <div className="easy-form-group" />
      </div>

      {formData.basement && formData.basement !== 'none' && (
        <div className="easy-form-group">
          <label className="easy-form-label" style={{ marginBottom: '8px', display: 'block' }}>
            🧱 {t('basementExtras')}
          </label>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            {t('basementExtrasHint')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {BASEMENT_EXTRA_ITEMS.map(key => {
              const selected = parseBasementExtras(formData.basementExtras);
              const checked = selected.includes(key);
              const toggle = () => {
                const next = checked ? selected.filter(k => k !== key) : [...selected, key];
                update('basementExtras', JSON.stringify(next));
              };
              return (
                <label key={key} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                  fontSize: '13px', border: `1.5px solid ${checked ? '#C9A84C' : '#e2e8f0'}`,
                  background: checked ? '#FFF8DC' : '#fff',
                  borderRadius: '8px', padding: '6px 12px',
                }}>
                  <input type="checkbox" checked={checked} onChange={toggle} />
                  {t(key)}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
