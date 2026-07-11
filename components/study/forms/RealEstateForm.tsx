'use client';

import { useTranslations } from 'next-intl';
import { IntegratedForm }  from './IntegratedForm';
import { RenovationForm }  from './RenovationForm';
import { EfficiencyForm }  from './EfficiencyForm';
import { FinishingForm }   from './FinishingForm';
import { IndustrialForm }  from './IndustrialForm';

type RealEstateSubType = 'integrated' | 'residential' | 'renovation' | 'efficiency' | 'finishing' | 'industrial' | null;

interface RealEstateFormProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
  subType?: RealEstateSubType;
}

const RequiredBadge = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-required">{label}</span>
);
const OptionalBadge = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-optional">{label}</span>
);

export function RealEstateForm({ formData, onChange, subType }: RealEstateFormProps) {
  const t = useTranslations('easyStart');

  const MIXED_SECTORS = [
    { key: 'commercial',     icon: '🏬', label: t('reSectorCommercial') },
    { key: 'administrative', icon: '🏢', label: t('reSectorAdmin') },
    { key: 'medical',        icon: '🏥', label: t('reSectorMedical') },
    { key: 'hotel',          icon: '🏨', label: t('reSectorHotel') },
  ];

  const updateField = (field: string, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  const toggleMixedSector = (key: string) => {
    const field = `mixedHas_${key}`;
    updateField(field, formData[field] === 'true' ? 'false' : 'true');
  };

  if (subType === 'integrated')  return <IntegratedForm  formData={formData} onChange={onChange} />;
  if (subType === 'renovation')  return <RenovationForm  formData={formData} onChange={onChange} />;
  if (subType === 'efficiency')  return <EfficiencyForm  formData={formData} onChange={onChange} />;
  if (subType === 'finishing')   return <FinishingForm   formData={formData} onChange={onChange} />;
  if (subType === 'industrial')  return <IndustrialForm  formData={formData} onChange={onChange} />;

  const isMixed = formData.projectType === 'mixed';

  return (
    <>
      {/* Project type + finishing level */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('projectTypeDetailed')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.projectType || 'residential'}
            onChange={(e) => updateField('projectType', e.target.value)}
          >
            <option value="residential">{t('projectTypes.residential')}</option>
            <option value="commercial">{t('projectTypes.commercial')}</option>
            <option value="administrative">{t('projectTypes.administrative')}</option>
            <option value="hotel">{t('projectTypes.hotel')}</option>
            <option value="tourist">{t('projectTypes.tourist')}</option>
            <option value="mixed">{t('projectTypes.mixed')}</option>
          </select>
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('finishingLevel')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.finishingLevel || 'medium'}
            onChange={(e) => updateField('finishingLevel', e.target.value)}
          >
            <option value="none">{t('finishingNone')}</option>
            <option value="normal">{t('finishingNormal')}</option>
            <option value="medium">{t('finishingMedium')}</option>
            <option value="premium">{t('finishingPremium')}</option>
            <option value="luxury">{t('finishingLuxury')}</option>
          </select>
        </div>
      </div>

      {/* Mixed-use: sector toggles + floor allocation */}
      {isMixed && (
        <div className="easy-mixed-wrap easy-fade-in">
          <p className="easy-mixed-title">{t('reMixedTitle')}</p>
          <p className="easy-mixed-hint">{t('reMixedHint')}</p>

          <div className="easy-mixed-sectors">
            <div className="easy-mixed-sector-card always">
              <span>🏠</span>
              <span>{t('reResidential')}</span>
              <span className="easy-mixed-fixed">{t('reFixed')}</span>
            </div>
            {MIXED_SECTORS.map(s => {
              const active = formData[`mixedHas_${s.key}`] === 'true';
              return (
                <button
                  key={s.key}
                  type="button"
                  className={`easy-mixed-sector-card${active ? ' sel' : ''}`}
                  onClick={() => toggleMixedSector(s.key)}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                  {active && <span className="easy-mixed-check">✓</span>}
                </button>
              );
            })}
          </div>

          <div className="easy-mixed-floors">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {t('reResidentialFloors')}
                <OptionalBadge label={t('fieldOptional')} />
              </label>
              <input
                type="text"
                className="easy-form-input"
                placeholder={t('reResidentialFloorsPh')}
                value={formData.mixedFloors_residential || ''}
                onChange={e => updateField('mixedFloors_residential', e.target.value)}
              />
            </div>
            {MIXED_SECTORS.filter(s => formData[`mixedHas_${s.key}`] === 'true').map(s => (
              <div key={s.key} className="easy-form-group">
                <label className="easy-form-label">
                  {s.label} {t('finFloors')}
                  <OptionalBadge label={t('fieldOptional')} />
                </label>
                <input
                  type="text"
                  className="easy-form-input"
                  placeholder={t('reSectorFloorsPh')}
                  value={formData[`mixedFloors_${s.key}`] || ''}
                  onChange={e => updateField(`mixedFloors_${s.key}`, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Land area + land price */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('landArea')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('landAreaPlaceholder')}
            value={formData.landArea || ''}
            onChange={(e) => updateField('landArea', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('reLandPrice')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('reLandPricePh')}
            value={formData.landPrice || ''}
            onChange={(e) => updateField('landPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Construction area */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('constructionArea')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('constructionAreaPlaceholder')}
            value={formData.constructionArea || ''}
            onChange={(e) => updateField('constructionArea', e.target.value)}
          />
        </div>
        <div className="easy-form-group" />
      </div>

      {/* Ownership type */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('reOwnershipType')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.ownershipType || 'full'}
            onChange={(e) => updateField('ownershipType', e.target.value)}
          >
            <option value="full">{t('reOwnershipFull')}</option>
            <option value="usufruct">{t('reOwnershipUsufruct')}</option>
            <option value="partnership">{t('reOwnershipPartnership')}</option>
          </select>
        </div>
        <div className="easy-form-group" />
      </div>

      {/* Partnership shares */}
      {formData.ownershipType === 'partnership' && (
        <div className="easy-form-row easy-fade-in">
          <div className="easy-form-group">
            <label className="easy-form-label">
              {t('reOwnerShare')}
              <RequiredBadge label={t('fieldRequired')} />
            </label>
            <input
              type="text"
              className="easy-form-input"
              placeholder={t('reOwnerSharePh')}
              value={formData.ownerShare || ''}
              onChange={(e) => updateField('ownerShare', e.target.value)}
            />
          </div>
          <div className="easy-form-group">
            <label className="easy-form-label">
              {t('reDeveloperShare')}
              <RequiredBadge label={t('fieldRequired')} />
            </label>
            <input
              type="text"
              className="easy-form-input"
              placeholder={t('reDeveloperSharePh')}
              value={formData.developerShare || ''}
              onChange={(e) => updateField('developerShare', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Floors + Basement */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('floorsCount')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('floorsPlaceholder')}
            value={formData.floorsCount || ''}
            onChange={(e) => updateField('floorsCount', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('basement')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.basement || 'none'}
            onChange={(e) => updateField('basement', e.target.value)}
          >
            <option value="none">{t('noBasement')}</option>
            <option value="one">{t('oneBasement')}</option>
            <option value="two">{t('twoBasement')}</option>
            <option value="three">{t('threeBasement')}</option>
            <option value="four">{t('fourBasement')}</option>
          </select>
        </div>
      </div>

      {formData.basement && formData.basement !== 'none' && (
        <BasementExtras t={t} formData={formData} updateField={updateField} />
      )}
    </>
  );
}

/* ─── basement extra works (إحلال / شير وول / خوازيق) ──────────────────────── */
const BASEMENT_EXTRA_ITEMS = ['soilReplacement', 'shearWall', 'piles'] as const;

function parseBasementExtras(raw: string | undefined): string[] {
  if (!raw) return [];
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; }
  catch { return []; }
}

function BasementExtras({ t, formData, updateField }: {
  t: ReturnType<typeof useTranslations>;
  formData: Record<string, string>;
  updateField: (field: string, value: string) => void;
}) {
  const selected = parseBasementExtras(formData.basementExtras);
  const toggle = (key: string) => {
    const next = selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key];
    updateField('basementExtras', JSON.stringify(next));
  };

  return (
    <div className="easy-form-group">
      <label className="easy-form-label" style={{ marginBottom: '8px', display: 'block' }}>
        🧱 {t('basementExtras')}
      </label>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
        {t('basementExtrasHint')}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {BASEMENT_EXTRA_ITEMS.map(key => {
          const checked = selected.includes(key);
          return (
            <label key={key} style={{
              display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
              fontSize: '13px', border: `1.5px solid ${checked ? '#C9A84C' : '#e2e8f0'}`,
              background: checked ? '#FFF8DC' : '#fff',
              borderRadius: '8px', padding: '6px 12px',
            }}>
              <input type="checkbox" checked={checked} onChange={() => toggle(key)} />
              {t(key)}
            </label>
          );
        })}
      </div>
    </div>
  );
}
