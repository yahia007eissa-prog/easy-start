'use client';

import { useTranslations } from 'next-intl';
import { IntegratedForm }  from './IntegratedForm';
import { RenovationForm }  from './RenovationForm';
import { EfficiencyForm }  from './EfficiencyForm';
import { FinishingForm }   from './FinishingForm';

type RealEstateSubType = 'integrated' | 'residential' | 'renovation' | 'efficiency' | 'finishing' | null;

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

const MIXED_SECTORS = [
  { key: 'commercial',     icon: '🏬', label: 'تجاري' },
  { key: 'administrative', icon: '🏢', label: 'إداري' },
  { key: 'medical',        icon: '🏥', label: 'طبي' },
  { key: 'hotel',          icon: '🏨', label: 'فندقي' },
];

export function RealEstateForm({ formData, onChange, subType }: RealEstateFormProps) {
  const t = useTranslations('easyStart');

  const updateField = (field: string, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  const toggleMixedSector = (key: string) => {
    const field = `mixedHas_${key}`;
    updateField(field, formData[field] === 'true' ? 'false' : 'true');
  };

  // Integrated has its own full multi-tab form
  if (subType === 'integrated') {
    return <IntegratedForm formData={formData} onChange={onChange} />;
  }

  // Renovation: description + photos only
  if (subType === 'renovation') {
    return <RenovationForm formData={formData} onChange={onChange} />;
  }

  // Efficiency upgrade: activity + area + current/target photos
  if (subType === 'efficiency') {
    return <EfficiencyForm formData={formData} onChange={onChange} />;
  }

  // Finishing: unit type + area fields + finishing level
  if (subType === 'finishing') {
    return <FinishingForm formData={formData} onChange={onChange} />;
  }

  const isRenovation = false;
  const isFinishing  = subType === 'finishing';
  const isEfficiency = subType === 'efficiency';
  const isMixed      = formData.projectType === 'mixed';

  return (
    <>
      {/* Project type selector — shown for residential/default subtypes */}
      {!isRenovation && !isFinishing && !isEfficiency && (
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
      )}

      {/* Mixed-use: sector toggles + floor allocation */}
      {isMixed && (
        <div className="easy-mixed-wrap easy-fade-in">
          <p className="easy-mixed-title">القطاعات في المبنى المختلط</p>
          <p className="easy-mixed-hint">السكني موجود دائماً — اختر القطاعات الإضافية</p>

          <div className="easy-mixed-sectors">
            {/* Residential — always present, not toggleable */}
            <div className="easy-mixed-sector-card always">
              <span>🏠</span>
              <span>سكني</span>
              <span className="easy-mixed-fixed">ثابت</span>
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

          {/* Floor allocation per active sector */}
          <div className="easy-mixed-floors">
            <div className="easy-form-group">
              <label className="easy-form-label">
                أدوار السكني
                <OptionalBadge label={t('fieldOptional')} />
              </label>
              <input
                type="text"
                className="easy-form-input"
                placeholder="مثال: من الدور 3 إلى 10"
                value={formData.mixedFloors_residential || ''}
                onChange={e => updateField('mixedFloors_residential', e.target.value)}
              />
            </div>

            {MIXED_SECTORS.filter(s => formData[`mixedHas_${s.key}`] === 'true').map(s => (
              <div key={s.key} className="easy-form-group">
                <label className="easy-form-label">
                  أدوار {s.label}
                  <OptionalBadge label={t('fieldOptional')} />
                </label>
                <input
                  type="text"
                  className="easy-form-input"
                  placeholder="مثال: الدور الأرضي والأول"
                  value={formData[`mixedFloors_${s.key}`] || ''}
                  onChange={e => updateField(`mixedFloors_${s.key}`, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finishing-only: level + area */}
      {isFinishing && (
        <div className="easy-form-row">
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
      )}

      {/* Land + Construction area */}
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
            سعر متر الأرض
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder="مثال: 12,000 ج.م/م²"
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
            نوع الملكية
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.ownershipType || 'full'}
            onChange={(e) => updateField('ownershipType', e.target.value)}
          >
            <option value="full">ملكية ثابتة</option>
            <option value="usufruct">حق انتفاع</option>
            <option value="partnership">مشاركة (مالك الأرض + مطور)</option>
          </select>
        </div>
        <div className="easy-form-group" />
      </div>

      {/* Partnership shares — shown only when ownershipType === partnership */}
      {formData.ownershipType === 'partnership' && (
        <div className="easy-form-row easy-fade-in">
          <div className="easy-form-group">
            <label className="easy-form-label">
              نسبة مالك الأرض
              <RequiredBadge label={t('fieldRequired')} />
            </label>
            <input
              type="text"
              className="easy-form-input"
              placeholder="مثال: 40%"
              value={formData.ownerShare || ''}
              onChange={(e) => updateField('ownerShare', e.target.value)}
            />
          </div>
          <div className="easy-form-group">
            <label className="easy-form-label">
              نسبة المطور
              <RequiredBadge label={t('fieldRequired')} />
            </label>
            <input
              type="text"
              className="easy-form-input"
              placeholder="مثال: 60%"
              value={formData.developerShare || ''}
              onChange={(e) => updateField('developerShare', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Floors + Basement — not for finishing-only */}
      {!isFinishing && (
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
              <option value="more">{t('moreBasement')}</option>
            </select>
          </div>
        </div>
      )}
    </>
  );
}
