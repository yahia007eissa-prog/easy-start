'use client';

import { useTranslations } from 'next-intl';

interface EntertainmentTabProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const Req = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-required">{t('fieldRequired')}</span>
);
const Opt = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
);

export function EntertainmentTab({ formData, onChange }: EntertainmentTabProps) {
  const t  = useTranslations('easyStart');
  const ti = useTranslations('easyStart.integrated');

  const set = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  return (
    <div className="easy-tab-content">
      {/* Club type */}
      <div className="easy-form-group" style={{ marginBottom: '16px' }}>
        <label className="easy-form-label">
          {ti('entertainmentType')} <Req t={t} />
        </label>
        <div className="easy-res-type-grid">
          <button
            type="button"
            className={`easy-res-type-btn ${(formData.entertainmentType || 'standalone') === 'standalone' ? 'sel' : ''}`}
            onClick={() => set('entertainmentType', 'standalone')}
          >
            <span className="easy-res-type-icon">🏟️</span>
            <span className="easy-res-type-name">{ti('clubStandalone')}</span>
          </button>
          <button
            type="button"
            className={`easy-res-type-btn ${formData.entertainmentType === 'inMall' ? 'sel' : ''}`}
            onClick={() => set('entertainmentType', 'inMall')}
          >
            <span className="easy-res-type-icon">🎠</span>
            <span className="easy-res-type-name">{ti('clubInMall')}</span>
          </button>
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('clubArea')} <Req t={t} />
          </label>
          <input
            type="number" min="0"
            className="easy-form-input"
            placeholder="مثال: 5,000"
            value={formData.clubArea || ''}
            onChange={(e) => set('clubArea', e.target.value)}
          />
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('clubFacilities')} <Opt t={t} />
          </label>
          <textarea
            className="easy-form-input"
            rows={3}
            placeholder={ti('clubFacilitiesPlaceholder')}
            value={formData.clubFacilities || ''}
            onChange={(e) => set('clubFacilities', e.target.value)}
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
            value={formData.entertainmentRequirements || ''}
            onChange={(e) => set('entertainmentRequirements', e.target.value)}
          />
        </div>
      </div>

      <p className="easy-field-hint">📄 {ti('uploadLicenseHint')}</p>
    </div>
  );
}
