'use client';

import { useTranslations } from 'next-intl';

interface MedicalFormProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export function MedicalForm({ formData, onChange }: MedicalFormProps) {
  const t = useTranslations('easyStart');

  const updateField = (field: string, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <>
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">{t('projectTypeDetailed')}</label>
          <select
            className="easy-form-input"
            value={formData.projectType || 'hospital'}
            onChange={(e) => updateField('projectType', e.target.value)}
          >
            <option value="hospital">{t('projectTypes.hospital')}</option>
            <option value="clinic">{t('projectTypes.clinic')}</option>
            <option value="pharmacy">{t('projectTypes.pharmacy')}</option>
            <option value="laboratory">{t('projectTypes.laboratory')}</option>
            <option value="medicalCenter">{t('projectTypes.medicalCenter')}</option>
          </select>
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">{t('bedCount')}</label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('bedCountPlaceholder')}
            value={formData.bedCount || ''}
            onChange={(e) => updateField('bedCount', e.target.value)}
          />
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">{t('constructionArea')}</label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('constructionAreaPlaceholder')}
            value={formData.constructionArea || ''}
            onChange={(e) => updateField('constructionArea', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">{t('floorsCount')}</label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('floorsPlaceholder')}
            value={formData.floorsCount || ''}
            onChange={(e) => updateField('floorsCount', e.target.value)}
          />
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">{t('basement')}</label>
          <select
            className="easy-form-input"
            value={formData.basement || 'none'}
            onChange={(e) => updateField('basement', e.target.value)}
          >
            <option value="none">{t('noBasement')}</option>
            <option value="one">{t('oneBasement')}</option>
            <option value="two">{t('twoBasement')}</option>
            <option value="more">{t('moreBasement')}</option>
          </select>
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">{t('finishingLevel')}</label>
          <select
            className="easy-form-input"
            value={formData.finishingLevel || 'medium'}
            onChange={(e) => updateField('finishingLevel', e.target.value)}
          >
            <option value="normal">{t('finishingNormal')}</option>
            <option value="medium">{t('finishingMedium')}</option>
            <option value="premium">{t('finishingPremium')}</option>
            <option value="luxury">{t('finishingLuxury')}</option>
          </select>
        </div>
      </div>
    </>
  );
}
