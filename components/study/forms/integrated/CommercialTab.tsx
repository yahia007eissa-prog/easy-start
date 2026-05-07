'use client';

import { useTranslations } from 'next-intl';

interface CommercialTabProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const Req = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-required">{t('fieldRequired')}</span>
);
const Opt = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
);

export function CommercialTab({ formData, onChange }: CommercialTabProps) {
  const t  = useTranslations('easyStart');
  const ti = useTranslations('easyStart.integrated');

  const set = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  return (
    <div className="easy-tab-content">
      {/* Commercial type */}
      <div className="easy-form-group" style={{ marginBottom: '16px' }}>
        <label className="easy-form-label">
          {ti('commercialType')} <Req t={t} />
        </label>
        <div className="easy-res-type-grid">
          <button
            type="button"
            className={`easy-res-type-btn ${(formData.commercialType || 'mall') === 'mall' ? 'sel' : ''}`}
            onClick={() => set('commercialType', 'mall')}
          >
            <span className="easy-res-type-icon">🏬</span>
            <span className="easy-res-type-name">{ti('mall')}</span>
          </button>
          <button
            type="button"
            className={`easy-res-type-btn ${formData.commercialType === 'shops' ? 'sel' : ''}`}
            onClick={() => set('commercialType', 'shops')}
          >
            <span className="easy-res-type-icon">🛒</span>
            <span className="easy-res-type-name">{ti('standaloneShops')}</span>
          </button>
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
            className={`easy-unit-btn ${formData.commercialBuildingStatus !== 'shared' ? 'active' : ''}`}
            onClick={() => set('commercialBuildingStatus', 'standalone')}
          >
            {ti('standalone')}
          </button>
          <button
            type="button"
            className={`easy-unit-btn ${formData.commercialBuildingStatus === 'shared' ? 'active' : ''}`}
            onClick={() => set('commercialBuildingStatus', 'shared')}
          >
            {ti('sharedBuilding')}
          </button>
        </div>
        {formData.commercialBuildingStatus === 'shared' && (
          <p className="easy-field-hint" style={{ marginTop: '6px' }}>
            💡 {ti('sharedBuildingNote')}
          </p>
        )}
      </div>

      {/* Area + Floors */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('mallArea')} <Req t={t} />
          </label>
          <input
            type="number" min="0"
            className="easy-form-input"
            placeholder="مثال: 10,000"
            value={formData.commercialArea || ''}
            onChange={(e) => set('commercialArea', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('mallFloors')} <Req t={t} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder="مثال: أرضي + 3"
            value={formData.commercialFloors || ''}
            onChange={(e) => set('commercialFloors', e.target.value)}
          />
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('buildingRequirements')} <Opt t={t} />
          </label>
          <textarea
            className="easy-form-input"
            rows={3}
            placeholder={ti('buildingRequirementsPlaceholder')}
            value={formData.commercialRequirements || ''}
            onChange={(e) => set('commercialRequirements', e.target.value)}
          />
        </div>
      </div>

      <p className="easy-field-hint">📄 {ti('uploadLicenseHint')}</p>
    </div>
  );
}
