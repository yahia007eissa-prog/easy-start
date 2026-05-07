'use client';

import { useTranslations } from 'next-intl';

interface MedicalTabProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const Req = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-required">{t('fieldRequired')}</span>
);
const Opt = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
);

type MedType = 'clinics' | 'hospital' | 'dispensary' | 'mixed';

export function MedicalTab({ formData, onChange }: MedicalTabProps) {
  const t  = useTranslations('easyStart');
  const ti = useTranslations('easyStart.integrated');

  const set = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  const medType = (formData.medicalType as MedType) || 'clinics';
  const showBeds = medType === 'hospital' || medType === 'mixed';

  return (
    <div className="easy-tab-content">
      {/* Medical type */}
      <div className="easy-form-group" style={{ marginBottom: '16px' }}>
        <label className="easy-form-label">
          {ti('medicalType')} <Req t={t} />
        </label>
        <div className="easy-res-type-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {(['clinics', 'hospital', 'dispensary', 'mixed'] as MedType[]).map((type) => (
            <button
              key={type}
              type="button"
              className={`easy-res-type-btn ${medType === type ? 'sel' : ''}`}
              onClick={() => set('medicalType', type)}
            >
              <span className="easy-res-type-icon">
                {type === 'clinics' ? '🩺' : type === 'hospital' ? '🏥' : type === 'dispensary' ? '🚑' : '🏥'}
              </span>
              <span className="easy-res-type-name">{ti(type === 'mixed' ? 'mixedMedical' : type)}</span>
              {type === 'mixed' && (
                <span className="easy-res-type-sub">{ti('mixedMedicalSub')}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Building status */}
      <div className="easy-form-group" style={{ marginBottom: '16px' }}>
        <label className="easy-form-label">
          {ti('buildingStatus')} <Req t={t} />
        </label>
        <div className="easy-unit-toggle">
          <button
            type="button"
            className={`easy-unit-btn ${formData.medicalBuildingStatus !== 'shared' ? 'active' : ''}`}
            onClick={() => set('medicalBuildingStatus', 'standalone')}
          >
            {ti('standalone')}
          </button>
          <button
            type="button"
            className={`easy-unit-btn ${formData.medicalBuildingStatus === 'shared' ? 'active' : ''}`}
            onClick={() => set('medicalBuildingStatus', 'shared')}
          >
            {ti('sharedBuilding')}
          </button>
        </div>
        {formData.medicalBuildingStatus === 'shared' && (
          <p className="easy-field-hint" style={{ marginTop: '6px' }}>
            💡 {ti('sharedBuildingNote')}
          </p>
        )}
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('medicalArea')} <Req t={t} />
          </label>
          <input
            type="number" min="0"
            className="easy-form-input"
            placeholder="مثال: 2,000"
            value={formData.medicalArea || ''}
            onChange={(e) => set('medicalArea', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('medicalFloors')} <Req t={t} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder="مثال: أرضي + 4"
            value={formData.medicalFloors || ''}
            onChange={(e) => set('medicalFloors', e.target.value)}
          />
        </div>
      </div>

      {showBeds && (
        <div className="easy-form-row easy-fade-in">
          <div className="easy-form-group">
            <label className="easy-form-label">
              {ti('bedsCount')} <Req t={t} />
            </label>
            <input
              type="number" min="0"
              className="easy-form-input"
              placeholder={ti('bedsCountPlaceholder')}
              value={formData.bedsCount || ''}
              onChange={(e) => set('bedsCount', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('buildingRequirements')} <Opt t={t} />
          </label>
          <textarea
            className="easy-form-input"
            rows={3}
            placeholder={ti('buildingRequirementsPlaceholder')}
            value={formData.medicalRequirements || ''}
            onChange={(e) => set('medicalRequirements', e.target.value)}
          />
        </div>
      </div>

      <p className="easy-field-hint">📄 {ti('uploadLicenseHint')}</p>
    </div>
  );
}
