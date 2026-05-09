'use client';

import { useTranslations } from 'next-intl';
import { ImageUploadZone } from './renovation/ImageUploadZone';

interface FinishingFormProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const RequiredBadge  = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-required">{label}</span>
);
const OptionalBadge  = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-optional">{label}</span>
);

export function FinishingForm({ formData, onChange }: FinishingFormProps) {
  const t = useTranslations('easyStart');
  const update = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  const UNIT_TYPES = [
    { value: 'apartment',  icon: '🏠',  name: t('finUnitApartment') },
    { value: 'villa',      icon: '🏡',  name: t('finUnitVilla') },
    { value: 'clinic',     icon: '🩺',  name: t('finUnitClinic') },
    { value: 'medical',    icon: '🏥',  name: t('finUnitMedical') },
    { value: 'commercial', icon: '🏬',  name: t('finUnitCommercial') },
    { value: 'admin',      icon: '🏢',  name: t('finUnitAdmin') },
    { value: 'hotel',      icon: '🏨',  name: t('finUnitHotel') },
    { value: 'factory',    icon: '🏭',  name: t('finUnitFactory') },
    { value: 'mixed',      icon: '🏗️', name: t('finUnitMixed') },
  ];

  const FINISHING_LEVELS = [
    { value: 'normal',  label: t('finLevelNormal'),  hint: t('finLevelNormalHint') },
    { value: 'medium',  label: t('finLevelMedium'),  hint: t('finLevelMediumHint') },
    { value: 'premium', label: t('finLevelPremium'), hint: t('finLevelPremiumHint') },
    { value: 'luxury',  label: t('finLevelLuxury'),  hint: t('finLevelLuxuryHint') },
  ];

  const CEILING_HEIGHTS = [
    { value: '2.8', label: '2.8 m' },
    { value: '3.0', label: '3.0 m' },
    { value: '3.2', label: '3.2 m' },
    { value: '3.6', label: t('finCeilingHeightStandard'), standard: true },
    { value: '4.0', label: '4.0 m' },
    { value: '4.5', label: '4.5 m' },
    { value: '5.0', label: '5.0 m' },
    { value: 'custom', label: t('finCeilingHeightCustom') },
  ];

  const unitType      = formData.finishingUnitType || '';
  const isResidential = unitType === 'apartment' || unitType === 'villa';
  const isClinical    = unitType === 'clinic' || unitType === 'medical';
  const isCommercial  = unitType === 'commercial' || unitType === 'admin' || unitType === 'hotel' || unitType === 'factory';
  const isMixed       = unitType === 'mixed';

  const docs: string[] = formData.officialDocs ? JSON.parse(formData.officialDocs) : [];
  const hasDocuments = docs.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Floor plan upload ── */}
      <div className="easy-finishing-docs-wrap">
        <div className="easy-finishing-docs-header">
          <span className="easy-finishing-docs-icon">📐</span>
          <div>
            <p className="easy-finishing-docs-title">{t('finUploadPlan')}</p>
            <p className="easy-finishing-docs-hint">{t('finUploadPlanHint')}</p>
          </div>
        </div>
        <ImageUploadZone
          images={docs}
          onImagesChange={imgs => update('officialDocs', JSON.stringify(imgs))}
        />
        {hasDocuments && (
          <div className="easy-finishing-docs-success easy-fade-in">
            ✅ {docs.length} {t('finUploadSuccess')}
          </div>
        )}
      </div>

      {/* ── Unit type ── */}
      <div>
        <label className="easy-form-label" style={{ display: 'block', marginBottom: '10px' }}>
          {t('finUnitType')}
          {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
        </label>
        <div className="easy-finishing-type-grid">
          {UNIT_TYPES.map(u => (
            <button key={u.value} type="button"
              className={`easy-finishing-type-btn${unitType === u.value ? ' sel' : ''}`}
              onClick={() => update('finishingUnitType', u.value)}
            >
              <span className="easy-finishing-type-icon">{u.icon}</span>
              <span className="easy-finishing-type-name">{u.name}</span>
              {unitType === u.value && <span className="easy-finishing-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Finishing level ── */}
      {unitType && (
        <div className="easy-fade-in">
          <label className="easy-form-label" style={{ display: 'block', marginBottom: '10px' }}>
            {t('finFinishingLevel')}
            {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
          </label>
          <div className="easy-finishing-level-grid">
            {FINISHING_LEVELS.map(fl => (
              <button key={fl.value} type="button"
                className={`easy-finishing-level-btn${formData.finishingLevel === fl.value ? ' sel' : ''}`}
                onClick={() => update('finishingLevel', fl.value)}
              >
                <span className="easy-finishing-level-name">{fl.label}</span>
                <span className="easy-finishing-level-hint">{fl.hint}</span>
                {formData.finishingLevel === fl.value && <span className="easy-finishing-level-check">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Area fields + ceiling ── */}
      {unitType && (
        <div className="easy-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Ceiling height */}
          <div className="easy-finishing-ceiling-wrap">
            <div className="easy-form-row">
              <div className="easy-form-group">
                <label className="easy-form-label">
                  {t('finCeilingHeight')}
                  <OptionalBadge label={t('fieldOptional')} />
                </label>
                <select className="easy-form-input"
                  value={formData.ceilingHeight || ''}
                  onChange={e => update('ceilingHeight', e.target.value)}
                >
                  <option value="">{t('finSelectHeight')}</option>
                  {CEILING_HEIGHTS.map(h => (
                    <option key={h.value} value={h.value}>{h.label}</option>
                  ))}
                </select>
              </div>
              {formData.ceilingHeight === 'custom' && (
                <div className="easy-form-group easy-fade-in">
                  <label className="easy-form-label">
                    {t('finCustomHeight')}
                    <RequiredBadge label={t('fieldRequired')} />
                  </label>
                  <input type="text" className="easy-form-input"
                    placeholder={t('finCustomHeightPh')}
                    value={formData.ceilingHeightCustom || ''}
                    onChange={e => update('ceilingHeightCustom', e.target.value)} />
                </div>
              )}
            </div>
            {formData.ceilingHeight && formData.ceilingHeight !== '3.6' && formData.ceilingHeight !== 'custom' && (
              <p className="easy-field-hint easy-fade-in" style={{ color: '#f59e0b' }}>
                ⚠️ {t('finHeightWarning')}
              </p>
            )}
            {(formData.ceilingHeight === '3.6' || !formData.ceilingHeight) && (
              <p className="easy-field-hint">{t('finEgyptianCode')}</p>
            )}
          </div>

          {/* Residential */}
          {isResidential && (
            <>
              <div className="easy-form-row">
                <div className="easy-form-group">
                  <label className="easy-form-label">
                    {t('finTotalArea')}
                    {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
                  </label>
                  <input type="text" className="easy-form-input"
                    placeholder={t('finTotalAreaPh')}
                    value={formData.unitArea || ''}
                    onChange={e => update('unitArea', e.target.value)} />
                </div>
                <div className="easy-form-group">
                  <label className="easy-form-label">
                    {t('finRooms')}
                    <OptionalBadge label={t('fieldOptional')} />
                  </label>
                  <select className="easy-form-input"
                    value={formData.roomsCount || ''}
                    onChange={e => update('roomsCount', e.target.value)}>
                    <option value="">{t('finSelectRooms')}</option>
                    {['1','2','3','4','5','6','7+'].map(n => (
                      <option key={n} value={n}>{n} {n === '1' ? t('finRoom') : t('finRooms2')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="easy-form-row">
                <div className="easy-form-group">
                  <label className="easy-form-label">
                    {t('finBathrooms')}
                    <OptionalBadge label={t('fieldOptional')} />
                  </label>
                  <select className="easy-form-input"
                    value={formData.bathroomsCount || ''}
                    onChange={e => update('bathroomsCount', e.target.value)}>
                    <option value="">{t('finSelectRooms')}</option>
                    {['1','2','3','4','5+'].map(n => (
                      <option key={n} value={n}>{n} {n === '1' ? t('finBathroom') : t('finBathrooms2')}</option>
                    ))}
                  </select>
                </div>
                {unitType === 'villa' && (
                  <div className="easy-form-group">
                    <label className="easy-form-label">
                      {t('finFloors')}
                      {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
                    </label>
                    <select className="easy-form-input"
                      value={formData.floorsCount || ''}
                      onChange={e => update('floorsCount', e.target.value)}>
                      <option value="">{t('finSelectRooms')}</option>
                      {['1','2','3','4'].map(n => (
                        <option key={n} value={n}>{n} {n === '1' ? t('finFloor') : t('finFloors2')}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="easy-finishing-phase-note">
                <span>💡</span>
                <p>{t('finPhasedHint')}</p>
              </div>
            </>
          )}

          {/* Clinical */}
          {isClinical && (
            <div className="easy-form-row">
              <div className="easy-form-group">
                <label className="easy-form-label">
                  {t('finClinicArea')}
                  {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
                </label>
                <input type="text" className="easy-form-input"
                  placeholder={t('finClinicAreaPh')}
                  value={formData.unitArea || ''}
                  onChange={e => update('unitArea', e.target.value)} />
              </div>
              {unitType === 'medical' && (
                <div className="easy-form-group">
                  <label className="easy-form-label">
                    {t('finClinicFloors')}
                    <OptionalBadge label={t('fieldOptional')} />
                  </label>
                  <select className="easy-form-input"
                    value={formData.floorsCount || ''}
                    onChange={e => update('floorsCount', e.target.value)}>
                    <option value="">{t('finSelectRooms')}</option>
                    {['1','2','3','4','5','6'].map(n => (
                      <option key={n} value={n}>{n} {n === '1' ? t('finFloor') : t('finFloors2')}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="easy-form-group">
                <label className="easy-form-label">
                  {t('finClinicRooms')}
                  <OptionalBadge label={t('fieldOptional')} />
                </label>
                <input type="text" className="easy-form-input"
                  placeholder={t('finClinicRoomsPh')}
                  value={formData.roomsCount || ''}
                  onChange={e => update('roomsCount', e.target.value)} />
              </div>
            </div>
          )}

          {/* Commercial */}
          {isCommercial && (
            <div className="easy-form-row">
              <div className="easy-form-group">
                <label className="easy-form-label">
                  {t('finCommArea')}
                  {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
                </label>
                <input type="text" className="easy-form-input"
                  placeholder={t('finCommAreaPh')}
                  value={formData.unitArea || ''}
                  onChange={e => update('unitArea', e.target.value)} />
              </div>
              <div className="easy-form-group">
                <label className="easy-form-label">
                  {t('finCommFloors')}
                  <OptionalBadge label={t('fieldOptional')} />
                </label>
                <select className="easy-form-input"
                  value={formData.floorsCount || ''}
                  onChange={e => update('floorsCount', e.target.value)}>
                  <option value="">{t('finSelectRooms')}</option>
                  {['1','2','3','4','5','6','7','8','10+'].map(n => (
                    <option key={n} value={n}>{n} {n === '1' ? t('finFloor') : t('finFloors2')}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Mixed */}
          {isMixed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="easy-form-row">
                <div className="easy-form-group">
                  <label className="easy-form-label">
                    {t('finMixedArea')}
                    {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
                  </label>
                  <input type="text" className="easy-form-input"
                    placeholder={t('finMixedAreaPh')}
                    value={formData.unitArea || ''}
                    onChange={e => update('unitArea', e.target.value)} />
                </div>
                <div className="easy-form-group">
                  <label className="easy-form-label">
                    {t('finMixedFloors')}
                    <OptionalBadge label={t('fieldOptional')} />
                  </label>
                  <select className="easy-form-input"
                    value={formData.floorsCount || ''}
                    onChange={e => update('floorsCount', e.target.value)}>
                    <option value="">{t('finSelectRooms')}</option>
                    {['2','3','4','5','6','7','8','10+'].map(n => (
                      <option key={n} value={n}>{n} {t('finFloors2')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="easy-form-group" style={{ width: '100%' }}>
                <label className="easy-form-label">
                  {t('finFloorDist')}
                  <OptionalBadge label={t('fieldOptional')} />
                </label>
                <input type="text" className="easy-form-input"
                  placeholder={t('finFloorDistPh')}
                  value={formData.mixedFloorDesc || ''}
                  onChange={e => update('mixedFloorDesc', e.target.value)} />
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {t('finNotes')}
                <OptionalBadge label={t('fieldOptional')} />
              </label>
              <input type="text" className="easy-form-input"
                placeholder={t('finNotesPh')}
                value={formData.description || ''}
                onChange={e => update('description', e.target.value)} />
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
