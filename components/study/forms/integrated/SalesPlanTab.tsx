'use client';

import { useTranslations } from 'next-intl';

interface SalesPlanTabProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const ORDINALS = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة'];

const SECTORS = [
  { key: 'residential',    icon: '🏠', label: 'سكني',   condition: 'hasResidential' },
  { key: 'commercial',     icon: '🏬', label: 'تجاري',  condition: 'hasCommercial' },
  { key: 'administrative', icon: '🏢', label: 'إداري',  condition: 'hasAdministrative' },
  { key: 'medical',        icon: '🏥', label: 'طبي',    condition: 'hasMedical' },
  { key: 'hotel',          icon: '🏨', label: 'فندقي',  condition: 'hasHotel' },
  { key: 'entertainment',  icon: '🎭', label: 'ترفيهي', condition: 'hasEntertainment' },
];

const RequiredBadge = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-required">{label}</span>
);
const OptionalBadge = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-optional">{label}</span>
);

export function SalesPlanTab({ formData, onChange }: SalesPlanTabProps) {
  const ti = useTranslations('easyStart.integrated');
  const t  = useTranslations('easyStart');

  const update = (field: string, value: string) => onChange({ ...formData, [field]: value });

  const phaseCount = parseInt(formData.salePhases || '0');

  const activeSectors = SECTORS.filter(s => formData[s.condition] === 'true');

  const togglePhaseComponent = (phaseIdx: number, sectorKey: string) => {
    const field = `salePhase${phaseIdx}Components`;
    const current = (formData[field] || '').split(',').filter(Boolean);
    const next = current.includes(sectorKey)
      ? current.filter(c => c !== sectorKey)
      : [...current, sectorKey];
    update(field, next.join(','));
  };

  const isSelected = (phaseIdx: number, sectorKey: string) => {
    const raw = formData[`salePhase${phaseIdx}Components`] || '';
    return raw.split(',').includes(sectorKey);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Duration + Phase count */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('saleDuration')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={ti('saleDurationPlaceholder')}
            value={formData.saleDuration || ''}
            onChange={e => update('saleDuration', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {ti('salePhases')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.salePhases || '0'}
            onChange={e => update('salePhases', e.target.value)}
          >
            <option value="0">اختر عدد المراحل</option>
            {[1,2,3,4,5,6].map(n => (
              <option key={n} value={String(n)}>{n} {n === 1 ? 'مرحلة' : 'مراحل'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Phase cards */}
      {phaseCount > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Array.from({ length: phaseCount }, (_, i) => {
            const idx = i + 1;
            return (
              <div key={idx} className="easy-phase-card">
                <div className="easy-phase-card-header">
                  <span className="easy-phase-num">{idx}</span>
                  <span>المرحلة {ORDINALS[i]}</span>
                </div>

                {/* Sector toggles */}
                {activeSectors.length > 0 ? (
                  <div>
                    <p className="easy-phase-hint">{ti('phaseComponentsHint')}</p>
                    <div className="easy-phase-sectors">
                      {activeSectors.map(s => {
                        const sel = isSelected(idx, s.key);
                        return (
                          <button
                            key={s.key}
                            type="button"
                            className={`easy-phase-sector-btn${sel ? ' sel' : ''}`}
                            onClick={() => togglePhaseComponent(idx, s.key)}
                          >
                            <span>{s.icon}</span>
                            <span>{s.label}</span>
                            {sel && <span className="easy-phase-check">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="easy-phase-hint" style={{ color: '#f59e0b' }}>
                    اختر مكونات المشروع أولاً من تاب المكونات
                  </p>
                )}

                {/* Sale price per sqm (optional) */}
                <div className="easy-form-group" style={{ marginTop: '12px' }}>
                  <label className="easy-form-label">
                    {ti('phaseSalePrice')}
                    <OptionalBadge label={t('fieldOptional')} />
                  </label>
                  <input
                    type="text"
                    className="easy-form-input"
                    placeholder={ti('phaseSalePricePlaceholder')}
                    value={formData[`salePhase${idx}SalePrice`] || ''}
                    onChange={e => update(`salePhase${idx}SalePrice`, e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {phaseCount === 0 && (
        <div className="easy-phase-empty">
          حدد عدد مراحل البيع بالأعلى لتظهر تفاصيل كل مرحلة
        </div>
      )}
    </div>
  );
}
