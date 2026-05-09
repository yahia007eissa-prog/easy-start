'use client';

import { useTranslations } from 'next-intl';
import { LocationPicker } from './LocationPicker';

interface CommonFieldsProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export function CommonFields({ formData, onChange }: CommonFieldsProps) {
  const t = useTranslations('easyStart');

  const updateField = (field: string, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <>
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">{t('projectName')}</label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('projectNamePlaceholder')}
            value={formData.projectName || ''}
            onChange={(e) => updateField('projectName', e.target.value)}
          />
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">{t('location')}</label>
          <LocationPicker
            value={formData.location || ''}
            onChange={(v) => updateField('location', v)}
            lat={formData.locationLat}
            lng={formData.locationLng}
            onLatLngChange={(lat, lng) => onChange({ ...formData, locationLat: lat, locationLng: lng })}
          />
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">{t('description')}</label>
          <textarea
            className="easy-form-input"
            placeholder={t('descriptionPlaceholder')}
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </>
  );
}
