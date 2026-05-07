'use client';

import { useTranslations } from 'next-intl';

interface ResidentialTabProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const Req = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-required">{t('fieldRequired')}</span>
);
const Opt = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
);

type ResType = 'villas' | 'apartments' | 'mixed';

export function ResidentialTab({ formData, onChange }: ResidentialTabProps) {
  const t  = useTranslations('easyStart');
  const ti = useTranslations('easyStart.integrated');

  const set = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  const resType = (formData.residentialType as ResType) || 'villas';
  const showVillas     = resType === 'villas'     || resType === 'mixed';
  const showApartments = resType === 'apartments' || resType === 'mixed';

  return (
    <div className="easy-tab-content">

      {/* Residential type selector */}
      <div className="easy-form-group" style={{ marginBottom: '16px' }}>
        <label className="easy-form-label">
          {ti('residentialType')} <Req t={t} />
        </label>
        <div className="easy-res-type-grid">
          {/* فيلات */}
          <button
            type="button"
            className={`easy-res-type-btn ${resType === 'villas' ? 'sel' : ''}`}
            onClick={() => set('residentialType', 'villas')}
          >
            <span className="easy-res-type-icon">🏡</span>
            <span className="easy-res-type-name">{ti('villas')}</span>
          </button>

          {/* عمارات */}
          <button
            type="button"
            className={`easy-res-type-btn ${resType === 'apartments' ? 'sel' : ''}`}
            onClick={() => set('residentialType', 'apartments')}
          >
            <span className="easy-res-type-icon">🏢</span>
            <span className="easy-res-type-name">{ti('apartments')}</span>
          </button>

          {/* مشترك — with sub-label */}
          <button
            type="button"
            className={`easy-res-type-btn ${resType === 'mixed' ? 'sel' : ''}`}
            onClick={() => set('residentialType', 'mixed')}
          >
            <span className="easy-res-type-icon">🏘️</span>
            <span className="easy-res-type-name">{ti('mixedResidential')}</span>
            <span className="easy-res-type-sub">{ti('mixedResidentialSub')}</span>
          </button>
        </div>
      </div>

      {/* Building standalone / shared toggle */}
      <div className="easy-form-group" style={{ marginBottom: '16px' }}>
        <label className="easy-form-label">
          {ti('buildingStatus')} <Req t={t} />
        </label>
        <div className="easy-unit-toggle">
          <button
            type="button"
            className={`easy-unit-btn ${formData.residentialBuildingStatus !== 'shared' ? 'active' : ''}`}
            onClick={() => set('residentialBuildingStatus', 'standalone')}
          >
            {ti('standalone')}
          </button>
          <button
            type="button"
            className={`easy-unit-btn ${formData.residentialBuildingStatus === 'shared' ? 'active' : ''}`}
            onClick={() => set('residentialBuildingStatus', 'shared')}
          >
            {ti('sharedBuilding')}
          </button>
        </div>
        {formData.residentialBuildingStatus === 'shared' && (
          <p className="easy-field-hint" style={{ marginTop: '6px' }}>
            💡 {ti('sharedBuildingNote')}
          </p>
        )}
      </div>

      {/* ── Villas section ── */}
      {showVillas && (
        <>
          <div className="easy-form-section-title">
            🏡 {ti('villas')}
          </div>
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('villaCount')} <Req t={t} />
              </label>
              <input
                type="number" min="1"
                className="easy-form-input"
                placeholder="مثال: 50"
                value={formData.villaCount || ''}
                onChange={(e) => set('villaCount', e.target.value)}
              />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('villaArea')} <Req t={t} />
              </label>
              <input
                type="number" min="0"
                className="easy-form-input"
                placeholder="مثال: 300"
                value={formData.villaArea || ''}
                onChange={(e) => set('villaArea', e.target.value)}
              />
            </div>
          </div>
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('villaFloors')} <Req t={t} />
              </label>
              <input
                type="text"
                className="easy-form-input"
                placeholder="مثال: أرضي + 1"
                value={formData.villaFloors || ''}
                onChange={(e) => set('villaFloors', e.target.value)}
              />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('buildingRequirements')} <Opt t={t} />
              </label>
              <textarea
                className="easy-form-input"
                rows={2}
                placeholder={ti('buildingRequirementsPlaceholder')}
                value={formData.villaRequirements || ''}
                onChange={(e) => set('villaRequirements', e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {/* ── Apartments section ── */}
      {showApartments && (
        <>
          <div className="easy-form-section-title" style={{ marginTop: showVillas ? '12px' : '0' }}>
            🏢 {ti('apartments')}
          </div>
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('apartmentBuildingCount')} <Req t={t} />
              </label>
              <input
                type="number" min="1"
                className="easy-form-input"
                placeholder="مثال: 10"
                value={formData.apartmentBuildingCount || ''}
                onChange={(e) => set('apartmentBuildingCount', e.target.value)}
              />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('apartmentBuildingArea')} <Req t={t} />
              </label>
              <input
                type="number" min="0"
                className="easy-form-input"
                placeholder="مثال: 500"
                value={formData.apartmentBuildingArea || ''}
                onChange={(e) => set('apartmentBuildingArea', e.target.value)}
              />
            </div>
          </div>
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('apartmentFloors')} <Req t={t} />
              </label>
              <input
                type="text"
                className="easy-form-input"
                placeholder="مثال: أرضي + 8"
                value={formData.apartmentFloors || ''}
                onChange={(e) => set('apartmentFloors', e.target.value)}
              />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('unitsPerFloor')} <Opt t={t} />
              </label>
              <input
                type="number" min="1"
                className="easy-form-input"
                placeholder="مثال: 4"
                value={formData.unitsPerFloor || ''}
                onChange={(e) => set('unitsPerFloor', e.target.value)}
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
                rows={2}
                placeholder={ti('buildingRequirementsPlaceholder')}
                value={formData.apartmentRequirements || ''}
                onChange={(e) => set('apartmentRequirements', e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      <p className="easy-field-hint" style={{ marginTop: '10px' }}>
        📄 {ti('uploadLicenseHint')}
      </p>
    </div>
  );
}
