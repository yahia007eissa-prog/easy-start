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

const BASEMENT_OPTIONS = ['none', 'one', 'two', 'more'] as const;

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
              <option key={v} value={v}>{t(v === 'none' ? 'noBasement' : v === 'one' ? 'oneBasement' : v === 'two' ? 'twoBasement' : 'moreBasement')}</option>
            ))}
          </select>
        </div>
        <div className="easy-form-group" />
      </div>
    </>
  );
}
