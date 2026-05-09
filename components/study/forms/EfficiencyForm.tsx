'use client';

import { useTranslations } from 'next-intl';
import { ImageUploadZone } from './renovation/ImageUploadZone';

interface EfficiencyFormProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const RequiredBadge = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-required">{label}</span>
);
const OptionalBadge = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-optional">{label}</span>
);

export function EfficiencyForm({ formData, onChange }: EfficiencyFormProps) {
  const t = useTranslations('easyStart');

  const update = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  const ACTIVITY_OPTIONS = [
    { value: 'bank',        label: t('effActBank') },
    { value: 'hypermarket', label: t('effActHypermarket') },
    { value: 'fashion',     label: t('effActFashion') },
    { value: 'pharmacy',    label: t('effActPharmacy') },
    { value: 'restaurant',  label: t('effActRestaurant') },
    { value: 'cafe',        label: t('effActCafe') },
    { value: 'clinic',      label: t('effActClinic') },
    { value: 'gym',         label: t('effActGym') },
    { value: 'office',      label: t('effActOffice') },
    { value: 'showroom',    label: t('effActShowroom') },
    { value: 'hotel',       label: t('effActHotel') },
    { value: 'other',       label: t('effActOther') },
  ];

  const currentImages: string[] = formData.currentStateImages
    ? JSON.parse(formData.currentStateImages) : [];
  const targetImages: string[] = formData.targetStateImages
    ? JSON.parse(formData.targetStateImages) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Activity type */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('effActivityType')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.activityType || ''}
            onChange={e => update('activityType', e.target.value)}
          >
            <option value="">{t('effActivitySelect')}</option>
            {ACTIVITY_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {formData.activityType === 'other' && (
          <div className="easy-form-group easy-fade-in">
            <label className="easy-form-label">
              {t('effActivityName')}
              <RequiredBadge label={t('fieldRequired')} />
            </label>
            <input
              type="text"
              className="easy-form-input"
              placeholder={t('effActivityNamePh')}
              value={formData.activityCustomName || ''}
              onChange={e => update('activityCustomName', e.target.value)}
            />
          </div>
        )}

        {formData.activityType !== 'other' && (
          <div className="easy-form-group">
            <label className="easy-form-label">
              {t('effBrandName')}
              <OptionalBadge label={t('fieldOptional')} />
            </label>
            <input
              type="text"
              className="easy-form-input"
              placeholder={t('effBrandNamePh')}
              value={formData.brandName || ''}
              onChange={e => update('brandName', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Area + Floors */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('effTotalArea')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('effTotalAreaPh')}
            value={formData.totalArea || ''}
            onChange={e => update('totalArea', e.target.value)}
          />
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('effFloorsCount')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.floorsCount || '1'}
            onChange={e => update('floorsCount', e.target.value)}
          >
            {['1','2','3','4','5','6'].map(n => (
              <option key={n} value={n}>{n} {n === '1' ? t('effFloor') : t('effFloors')}</option>
            ))}
            <option value="more">{t('effMoreFloors')}</option>
          </select>
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('effTargetFinishing')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.targetFinishing || ''}
            onChange={e => update('targetFinishing', e.target.value)}
          >
            <option value="">{t('effFinishingUnset')}</option>
            <option value="normal">{t('finishingNormal')}</option>
            <option value="medium">{t('finishingMedium')}</option>
            <option value="premium">{t('finishingPremium')}</option>
            <option value="luxury">{t('finishingLuxury')}</option>
          </select>
        </div>
      </div>

      {/* Current state description */}
      <div className="easy-form-group" style={{ width: '100%' }}>
        <label className="easy-form-label">
          {t('effCurrentStateDesc')}
          <OptionalBadge label={t('fieldOptional')} />
        </label>
        <textarea
          className="easy-form-input easy-renovation-desc"
          placeholder={t('effCurrentStatePh')}
          rows={3}
          value={formData.currentStateDesc || ''}
          onChange={e => update('currentStateDesc', e.target.value)}
        />
      </div>

      {/* Current state photos */}
      <div className="easy-form-group" style={{ width: '100%' }}>
        <label className="easy-form-label">
          {t('effCurrentPhotos')}
          <RequiredBadge label={t('fieldRequired')} />
        </label>
        <ImageUploadZone
          images={currentImages}
          onImagesChange={imgs => update('currentStateImages', JSON.stringify(imgs))}
        />
        <p className="easy-field-hint">{t('effCurrentPhotosHint')}</p>
      </div>

      {/* Target */}
      <div className="easy-efficiency-target-wrap">
        <p className="easy-efficiency-target-title">{t('effTargetTitle')}</p>
        <p className="easy-efficiency-target-hint">{t('effTargetHint')}</p>
        <ImageUploadZone
          images={targetImages}
          onImagesChange={imgs => update('targetStateImages', JSON.stringify(imgs))}
        />
        <div className="easy-form-group" style={{ width: '100%', marginTop: '12px' }}>
          <label className="easy-form-label">
            {t('effTargetDesc')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <textarea
            className="easy-form-input easy-renovation-desc"
            placeholder={t('effTargetDescPh')}
            rows={4}
            value={formData.targetStateDesc || ''}
            onChange={e => update('targetStateDesc', e.target.value)}
          />
        </div>
      </div>

    </div>
  );
}
