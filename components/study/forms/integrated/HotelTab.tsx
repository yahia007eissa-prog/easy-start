'use client';

import { useTranslations } from 'next-intl';

interface HotelTabProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const Req = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-required">{t('fieldRequired')}</span>
);
const Opt = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
);

export function HotelTab({ formData, onChange }: HotelTabProps) {
  const t  = useTranslations('easyStart');
  const ti = useTranslations('easyStart.integrated');

  const set = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  return (
    <div className="easy-tab-content">
      {/* Hotel classification */}
      <div className="easy-form-group" style={{ marginBottom: '16px' }}>
        <label className="easy-form-label">
          {ti('hotelStars')} <Req t={t} />
        </label>
        <div className="easy-res-type-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {(['3', '4', '5', 'apart', 'resort'] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={`easy-res-type-btn ${(formData.hotelType || '4') === type ? 'sel' : ''}`}
              onClick={() => set('hotelType', type)}
            >
              <span className="easy-res-type-icon">
                {type === 'apart' ? '🏩' : type === 'resort' ? '🏖️' : '🏨'}
              </span>
              <span className="easy-res-type-name">{ti(`hotelType_${type}`)}</span>
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
            className={`easy-unit-btn ${formData.hotelBuildingStatus !== 'shared' ? 'active' : ''}`}
            onClick={() => set('hotelBuildingStatus', 'standalone')}
          >
            {ti('standalone')}
          </button>
          <button
            type="button"
            className={`easy-unit-btn ${formData.hotelBuildingStatus === 'shared' ? 'active' : ''}`}
            onClick={() => set('hotelBuildingStatus', 'shared')}
          >
            {ti('sharedBuilding')}
          </button>
        </div>
        {formData.hotelBuildingStatus === 'shared' && (
          <p className="easy-field-hint" style={{ marginTop: '6px' }}>
            💡 {ti('sharedBuildingNote')}
          </p>
        )}
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('hotelRooms')} <Req t={t} />
          </label>
          <input
            type="number" min="1"
            className="easy-form-input"
            placeholder="مثال: 150"
            value={formData.hotelRooms || ''}
            onChange={(e) => set('hotelRooms', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('hotelArea')} <Req t={t} />
          </label>
          <input
            type="number" min="0"
            className="easy-form-input"
            placeholder="مثال: 8,000"
            value={formData.hotelArea || ''}
            onChange={(e) => set('hotelArea', e.target.value)}
          />
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('hotelFloors')} <Req t={t} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder="مثال: أرضي + 10"
            value={formData.hotelFloors || ''}
            onChange={(e) => set('hotelFloors', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('hotelFacilities')} <Opt t={t} />
          </label>
          <textarea
            className="easy-form-input"
            rows={2}
            placeholder={ti('hotelFacilitiesPlaceholder')}
            value={formData.hotelFacilities || ''}
            onChange={(e) => set('hotelFacilities', e.target.value)}
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
            value={formData.hotelRequirements || ''}
            onChange={(e) => set('hotelRequirements', e.target.value)}
          />
        </div>
      </div>

      <p className="easy-field-hint">📄 {ti('uploadLicenseHint')}</p>
    </div>
  );
}
