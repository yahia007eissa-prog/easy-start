'use client';

import { useTranslations } from 'next-intl';

interface LandTabProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const Req = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-required">{t('fieldRequired')}</span>
);
const Opt = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
);

export function LandTab({ formData, onChange }: LandTabProps) {
  const t = useTranslations('easyStart');
  const ti = useTranslations('easyStart.integrated');

  const set = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  const isUsufruct = formData.ownershipType === 'usufruct';

  return (
    <div className="easy-tab-content">
      {/* Location */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('landLocation')} <Req t={t} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={ti('landLocationPlaceholder')}
            value={formData.landLocation || ''}
            onChange={(e) => set('landLocation', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('totalLandArea')} <Req t={t} />
          </label>
          <input
            type="number"
            min="0"
            className="easy-form-input"
            placeholder={ti('totalLandAreaPlaceholder')}
            value={formData.totalLandArea || ''}
            onChange={(e) => set('totalLandArea', e.target.value)}
          />
        </div>
      </div>

      {/* Price + Ownership */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('landPrice')} <Opt t={t} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={ti('landPricePlaceholder')}
            value={formData.landPrice || ''}
            onChange={(e) => set('landPrice', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('ownershipType')} <Req t={t} />
          </label>
          <select
            className="easy-form-input"
            value={formData.ownershipType || 'full'}
            onChange={(e) => set('ownershipType', e.target.value)}
          >
            <option value="full">{ti('ownershipFull')}</option>
            <option value="partnership">{ti('ownershipPartnership')}</option>
            <option value="usufruct">{ti('ownershipUsufruct')}</option>
          </select>
        </div>
      </div>

      {/* Usufruct duration — appears only when selected */}
      {isUsufruct && (
        <div className="easy-form-row easy-fade-in">
          <div className="easy-form-group">
            <label className="easy-form-label">
              {ti('usufructDuration')} <Req t={t} />
            </label>
            <input
              type="text"
              className="easy-form-input"
              placeholder={ti('usufructDurationPlaceholder')}
              value={formData.usufructDuration || ''}
              onChange={(e) => set('usufructDuration', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
