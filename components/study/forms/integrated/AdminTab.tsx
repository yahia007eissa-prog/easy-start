'use client';

import { useTranslations, useLocale } from 'next-intl';
import { FloorRatioList, useFloorRatio } from './FloorRatioList';

interface AdminTabProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const Req = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-required">{t('fieldRequired')}</span>
);

export function AdminTab({ formData, onChange }: AdminTabProps) {
  const t  = useTranslations('easyStart');
  const ti = useTranslations('easyStart.integrated');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const set = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  const adminRatio = useFloorRatio(formData, onChange, 'adminUniformRatio', 'adminUniformRatioValue', 'adminFloorRatios', 'adminBasementExtras');

  return (
    <div className="easy-tab-content">
      {/* Building status */}
      <div className="easy-form-group" style={{ marginBottom: '16px' }}>
        <label className="easy-form-label">
          {ti('buildingStatus')} <Req t={t} />
        </label>
        <div className="easy-unit-toggle">
          <button
            type="button"
            className={`easy-unit-btn ${formData.adminBuildingStatus !== 'shared' ? 'active' : ''}`}
            onClick={() => set('adminBuildingStatus', 'standalone')}
          >
            {ti('standalone')}
          </button>
          <button
            type="button"
            className={`easy-unit-btn ${formData.adminBuildingStatus === 'shared' ? 'active' : ''}`}
            onClick={() => set('adminBuildingStatus', 'shared')}
          >
            {ti('sharedBuilding')}
          </button>
        </div>
        {formData.adminBuildingStatus === 'shared' && (
          <p className="easy-field-hint" style={{ marginTop: '6px' }}>
            💡 {ti('sharedBuildingNote')}
          </p>
        )}
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('adminBuildingCount')} <Req t={t} />
          </label>
          <input
            type="number" min="1"
            className="easy-form-input"
            placeholder={isAr ? 'مثال: 2' : 'e.g. 2'}
            value={formData.adminBuildingCount || ''}
            onChange={(e) => set('adminBuildingCount', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('adminArea')} <Req t={t} />
          </label>
          <input
            type="number" min="0"
            className="easy-form-input"
            placeholder={isAr ? 'مثال: 3,000' : 'e.g. 3,000'}
            value={formData.adminArea || ''}
            onChange={(e) => set('adminArea', e.target.value)}
          />
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('adminFloors')} <Req t={t} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={isAr ? 'مثال: أرضي + 6' : 'e.g. Ground + 6'}
            value={formData.adminFloors || ''}
            onChange={(e) => set('adminFloors', e.target.value)}
          />
        </div>
        <div className="easy-form-group" />
      </div>

      {/* Floor ratios */}
      <FloorRatioList
        isAr={isAr}
        uniform={adminRatio.uniform}
        uniformRatio={formData.adminUniformRatioValue || ''}
        entries={adminRatio.floorEntries}
        onUniformChange={adminRatio.onUniformChange}
        onUniformRatioChange={adminRatio.onUniformRatioChange}
        onEntriesChange={adminRatio.setFloorEntries}
        basementExtras={adminRatio.basementExtras}
        onBasementExtrasChange={adminRatio.onBasementExtrasChange}
      />

      <p className="easy-field-hint" style={{ marginTop: '14px' }}>📄 {ti('uploadLicenseHint')}</p>
    </div>
  );
}
