'use client';

import { useTranslations } from 'next-intl';

interface IndustrialFormProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export function IndustrialForm({ formData, onChange }: IndustrialFormProps) {
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
            value={formData.projectType || 'factory'}
            onChange={(e) => updateField('projectType', e.target.value)}
          >
            <option value="factory">{t('projectTypes.factory')}</option>
            <option value="warehouse">{t('projectTypes.warehouse')}</option>
            <option value="workshop">{t('projectTypes.workshop')}</option>
            <option value="plant">{t('projectTypes.plant')}</option>
            <option value="refinery">{t('projectTypes.refinery')}</option>
          </select>
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">{t('industryType')}</label>
          <select
            className="easy-form-input"
            value={formData.industryType || 'manufacturing'}
            onChange={(e) => updateField('industryType', e.target.value)}
          >
            <option value="manufacturing">{t('industryTypes.manufacturing')}</option>
            <option value="foodProcessing">{t('industryTypes.foodProcessing')}</option>
            <option value="textile">{t('industryTypes.textile')}</option>
            <option value="chemical">{t('industryTypes.chemical')}</option>
            <option value="automotive">{t('industryTypes.automotive')}</option>
          </select>
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">{t('landArea')}</label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('landAreaPlaceholder')}
            value={formData.landArea || ''}
            onChange={(e) => updateField('landArea', e.target.value)}
          />
        </div>
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
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">{t('powerCapacity')}</label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('powerCapacityPlaceholder')}
            value={formData.powerCapacity || ''}
            onChange={(e) => updateField('powerCapacity', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">{t('employeeCount')}</label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('employeeCountPlaceholder')}
            value={formData.employeeCount || ''}
            onChange={(e) => updateField('employeeCount', e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
