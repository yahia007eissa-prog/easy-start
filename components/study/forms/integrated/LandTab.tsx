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

  const isUsufruct    = formData.ownershipType === 'usufruct';
  const isPartnership = formData.ownershipType === 'partnership';
  const withFinishing = formData.finishingLevel && formData.finishingLevel !== 'none';

  const ownerPct     = parseFloat(formData.ownerShare || '0');
  const devPct       = parseFloat(formData.developerShare || '0');
  const totalLand    = parseFloat(formData.totalLandArea || '0');
  const ownerArea    = totalLand > 0 && ownerPct > 0 ? Math.round(totalLand * ownerPct / 100) : null;
  const devArea      = totalLand > 0 && devPct  > 0 ? Math.round(totalLand * devPct  / 100) : null;
  const sharesSum    = ownerPct + devPct;
  const sharesValid  = sharesSum === 100;

  return (
    <div className="easy-tab-content">
      {/* Land Area */}
      <div className="easy-form-row">
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
        <div className="easy-form-group" />
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

      {/* Usufruct duration */}
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

      {/* Finishing question */}
      <div className="easy-form-group" style={{ marginBottom: '16px' }}>
        <label className="easy-form-label">
          {ti('projectFinishingQ')}
        </label>
        <div className="easy-unit-toggle">
          <button
            type="button"
            className={`easy-unit-btn ${withFinishing ? 'active' : ''}`}
            onClick={() => set('finishingLevel', 'normal')}
          >
            🪟 {ti('withFinishing')}
          </button>
          <button
            type="button"
            className={`easy-unit-btn ${!withFinishing ? 'active' : ''}`}
            onClick={() => set('finishingLevel', 'none')}
          >
            🏗️ {ti('withoutFinishing')}
          </button>
        </div>
      </div>

      {/* Finishing level — shown only if finishing selected */}
      {withFinishing && (
        <div className="easy-form-row easy-fade-in">
          <div className="easy-form-group">
            <label className="easy-form-label">
              {ti('finishingLevelLabel')} <Req t={t} />
            </label>
            <div className="easy-res-type-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {(['normal', 'medium', 'premium', 'luxury'] as const).map(level => {
                const icons: Record<string, string> = { normal: '🪟', medium: '🛋️', premium: '💎', luxury: '🏆' };
                const labelKeys: Record<string, string> = {
                  normal: 'finishingNormal', medium: 'finishingMedium',
                  premium: 'finishingPremium', luxury: 'finishingLuxury',
                };
                return (
                  <button
                    key={level}
                    type="button"
                    className={`easy-res-type-btn ${formData.finishingLevel === level ? 'sel' : ''}`}
                    onClick={() => set('finishingLevel', level)}
                  >
                    <span className="easy-res-type-icon">{icons[level]}</span>
                    <span className="easy-res-type-name">{t(labelKeys[level])}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Partnership shares */}
      {isPartnership && (
        <div className="easy-fade-in" style={{ marginTop: '4px' }}>
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('ownerShare')} <Req t={t} />
              </label>
              <input
                type="number" min="1" max="99"
                className="easy-form-input"
                placeholder={ti('ownerSharePlaceholder')}
                value={formData.ownerShare || ''}
                onChange={(e) => set('ownerShare', e.target.value)}
              />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('developerShare')} <Req t={t} />
              </label>
              <input
                type="number" min="1" max="99"
                className="easy-form-input"
                placeholder={ti('developerSharePlaceholder')}
                value={formData.developerShare || ''}
                onChange={(e) => set('developerShare', e.target.value)}
              />
            </div>
          </div>

          {/* Summary row */}
          {(ownerPct > 0 || devPct > 0) && (
            <div style={{
              background: sharesValid ? '#f0fdf4' : '#fff7ed',
              border: `1.5px solid ${sharesValid ? '#86efac' : '#fdba74'}`,
              borderRadius: '10px', padding: '12px 16px', marginTop: '4px',
              fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              {/* shares sum warning */}
              <div style={{ color: sharesValid ? '#166534' : '#9a3412', fontWeight: 700 }}>
                {sharesValid
                  ? `✅ ${ti('partnershipNote')}`
                  : `⚠️ ${ti('partnershipNote')} — ${ti('currentTotal') || 'المجموع الحالي'}: ${sharesSum}%`}
              </div>
              {/* area breakdown */}
              {totalLand > 0 && ownerArea !== null && devArea !== null && (
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#1e40af', fontWeight: 600 }}>
                    🏠 {ti('ownerShare').replace(' (%)', '')}: {ownerArea.toLocaleString()} م²
                  </span>
                  <span style={{ color: '#6d28d9', fontWeight: 600 }}>
                    🏗️ {ti('developerShare').replace(' (%)', '')}: {devArea.toLocaleString()} م²
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
