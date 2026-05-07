'use client';

import { useTranslations } from 'next-intl';

interface AgriculturalFormProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const RequiredBadge = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-required">{label}</span>
);
const OptionalBadge = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-optional">{label}</span>
);

export function AgriculturalForm({ formData, onChange }: AgriculturalFormProps) {
  const t = useTranslations('easyStart');

  const updateField = (field: string, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  const areaUnit = (formData.areaUnit as 'sqm' | 'feddan') || 'feddan';

  const handleUnitChange = (unit: 'sqm' | 'feddan') => {
    onChange({ ...formData, areaUnit: unit, area: '', kirat: '' });
  };

  return (
    <>
      {/* ── Land Data ── */}
      <div className="easy-form-section-title">{t('landData')}</div>

      {/* Area Unit Toggle */}
      <div className="easy-form-group" style={{ marginBottom: '12px' }}>
        <label className="easy-form-label">
          {t('areaUnit')}
          <RequiredBadge label={t('fieldRequired')} />
        </label>
        <div className="easy-unit-toggle">
          <button
            type="button"
            className={`easy-unit-btn ${areaUnit === 'feddan' ? 'active' : ''}`}
            onClick={() => handleUnitChange('feddan')}
          >
            {t('areaUnitFeddan')}
          </button>
          <button
            type="button"
            className={`easy-unit-btn ${areaUnit === 'sqm' ? 'active' : ''}`}
            onClick={() => handleUnitChange('sqm')}
          >
            {t('areaUnitSqm')}
          </button>
        </div>
      </div>

      {/* Area fields based on unit */}
      {areaUnit === 'feddan' ? (
        <div className="easy-form-row">
          <div className="easy-form-group">
            <label className="easy-form-label">
              {t('areaFeddan')}
              <RequiredBadge label={t('fieldRequired')} />
            </label>
            <input
              type="number"
              min="0"
              className="easy-form-input"
              placeholder={t('areaFeddanPlaceholder')}
              value={formData.area || ''}
              onChange={(e) => updateField('area', e.target.value)}
            />
          </div>
          <div className="easy-form-group">
            <label className="easy-form-label">
              {t('areaKirat')}
              <OptionalBadge label={t('fieldOptional')} />
            </label>
            <input
              type="number"
              min="0"
              max="23"
              className="easy-form-input"
              placeholder={t('areaKiratPlaceholder')}
              value={formData.kirat || ''}
              onChange={(e) => updateField('kirat', e.target.value)}
            />
            <span className="easy-field-hint">{t('areaKiratHint')}</span>
          </div>
        </div>
      ) : (
        <div className="easy-form-row">
          <div className="easy-form-group">
            <label className="easy-form-label">
              {t('areaSqm')}
              <RequiredBadge label={t('fieldRequired')} />
            </label>
            <input
              type="number"
              min="0"
              className="easy-form-input"
              placeholder={t('areaSqmPlaceholder')}
              value={formData.area || ''}
              onChange={(e) => updateField('area', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('soilType')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.soil_type || 'clay'}
            onChange={(e) => updateField('soil_type', e.target.value)}
          >
            <option value="sandy">{t('soilTypes.sandy')}</option>
            <option value="clay">{t('soilTypes.clay')}</option>
            <option value="loam">{t('soilTypes.loam')}</option>
            <option value="silt">{t('soilTypes.silt')}</option>
            <option value="peat">{t('soilTypes.peat')}</option>
          </select>
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('reclaimStatus')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.reclaim_status || 'new'}
            onChange={(e) => updateField('reclaim_status', e.target.value)}
          >
            <option value="new">{t('reclaimStatusNew')}</option>
            <option value="partial">{t('reclaimStatusPartial')}</option>
            <option value="full">{t('reclaimStatusFull')}</option>
          </select>
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('soilPh')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('soilPhPlaceholder')}
            value={formData.ph || ''}
            onChange={(e) => updateField('ph', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('soilEc')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('soilEcPlaceholder')}
            value={formData.ec || ''}
            onChange={(e) => updateField('ec', e.target.value)}
          />
        </div>
      </div>

      {/* ── Water Data ── */}
      <div className="easy-form-section-title">{t('waterData')}</div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('waterSource')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.water_source || 'well'}
            onChange={(e) => updateField('water_source', e.target.value)}
          >
            <option value="well">{t('waterSources.well')}</option>
            <option value="river">{t('waterSources.river')}</option>
            <option value="irrigation">{t('waterSources.irrigation')}</option>
            <option value="desalination">{t('waterSources.desalination')}</option>
            <option value="rainwater">{t('waterSources.rainwater')}</option>
          </select>
        </div>
      </div>

      {(formData.water_source === 'well' || !formData.water_source) && (
        <div className="easy-form-well-data">
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {t('wellDepth')}
                <OptionalBadge label={t('fieldOptional')} />
              </label>
              <input
                type="text"
                className="easy-form-input"
                placeholder={t('wellDepthPlaceholder')}
                value={formData.well_depth || ''}
                onChange={(e) => updateField('well_depth', e.target.value)}
              />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {t('wellFlow')}
                <OptionalBadge label={t('fieldOptional')} />
              </label>
              <input
                type="text"
                className="easy-form-input"
                placeholder={t('wellFlowPlaceholder')}
                value={formData.well_flow || ''}
                onChange={(e) => updateField('well_flow', e.target.value)}
              />
            </div>
          </div>
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {t('waterTds')}
                <OptionalBadge label={t('fieldOptional')} />
              </label>
              <input
                type="text"
                className="easy-form-input"
                placeholder={t('waterTdsPlaceholder')}
                value={formData.water_tds || ''}
                onChange={(e) => updateField('water_tds', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Crop Data ── */}
      <div className="easy-form-section-title">{t('cropData')}</div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('cropType')}
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder={t('cropTypePlaceholder')}
            value={formData.crop || ''}
            onChange={(e) => updateField('crop', e.target.value)}
          />
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('postharvestGoal')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.postharvest_goal || 'local'}
            onChange={(e) => updateField('postharvest_goal', e.target.value)}
          >
            <option value="local">{t('postharvestLocal')}</option>
            <option value="export">{t('postharvestExport')}</option>
            <option value="processing">{t('postharvestProcessing')}</option>
            <option value="seeds">{t('postharvestSeeds')}</option>
          </select>
        </div>
      </div>

      {/* ── Buildings ── */}
      <div className="easy-form-section-title">{t('buildings')}</div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            {t('buildingsList')}
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <textarea
            className="easy-form-input"
            placeholder={t('buildingsListPlaceholder')}
            value={formData.buildings_list || ''}
            onChange={(e) => updateField('buildings_list', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </>
  );
}
