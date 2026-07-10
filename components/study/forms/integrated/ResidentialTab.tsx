'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FloorRatioList, useFloorRatio, parseFloorEntries } from './FloorRatioList';

interface ResidentialTabProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const Req = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-required">{t('fieldRequired')}</span>
);
const Opt = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <span className="easy-field-badge easy-field-optional">{t('fieldOptional')}</span>
);

type ResType = 'villas' | 'apartments' | 'mixed';

/* ─── Area entry (count + land area) ─────────────────────────────────────── */
interface AreaEntry { count: string; area: string; }
const EMPTY_AREA: AreaEntry = { count: '', area: '' };

function parseAreaEntries(raw: string | undefined): AreaEntry[] {
  if (!raw) return [{ ...EMPTY_AREA }];
  try { const p = JSON.parse(raw); return Array.isArray(p) && p.length ? p : [{ ...EMPTY_AREA }]; }
  catch { return [{ ...EMPTY_AREA }]; }
}

function AreaList({ entries, onChange, countLabel, areaLabel, isAr }: {
  entries: AreaEntry[];
  onChange: (e: AreaEntry[]) => void;
  countLabel: string;
  areaLabel: string;
  isAr: boolean;
}) {
  const upd = (i: number, f: keyof AreaEntry, v: string) =>
    onChange(entries.map((e, idx) => idx === i ? { ...e, [f]: v } : e));
  const rm  = (i: number) => onChange(entries.filter((_, idx) => idx !== i));
  const add = ()           => onChange([...entries, { ...EMPTY_AREA }]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {entries.map((entry, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-end', gap: '10px',
          background: '#f8f9fb', borderRadius: '10px', padding: '12px 14px',
          border: '1.5px solid #e2e8f0',
        }}>
          <div style={{
            minWidth: '26px', height: '26px', borderRadius: '50%',
            background: 'var(--purple-light)', color: 'var(--purple-dark)',
            fontWeight: 700, fontSize: '12px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>{i + 1}</div>

          <div className="easy-form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="easy-form-label" style={{ fontSize: '11px' }}>{countLabel}</label>
            <input type="number" min="1" className="easy-form-input"
              placeholder={isAr ? 'مثال: 50' : 'e.g. 50'}
              value={entry.count} onChange={e => upd(i, 'count', e.target.value)} />
          </div>

          <div className="easy-form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="easy-form-label" style={{ fontSize: '11px' }}>{areaLabel}</label>
            <input type="number" min="0" className="easy-form-input"
              placeholder={isAr ? 'مثال: 300' : 'e.g. 300'}
              value={entry.area} onChange={e => upd(i, 'area', e.target.value)} />
          </div>

          {entries.length > 1 && (
            <button type="button" onClick={() => rm(i)}
              title={isAr ? 'حذف' : 'Remove'}
              style={{
                width: '30px', height: '30px', borderRadius: '50%',
                border: '1.5px solid #e74c3c', background: 'white',
                color: '#e74c3c', cursor: 'pointer', fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '2px', flexShrink: 0,
              }}>✕</button>
          )}
        </div>
      ))}

      <button type="button" onClick={add} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 14px', borderRadius: '8px', fontSize: '12px',
        border: '1.5px dashed var(--purple)', background: 'var(--purple-faint)',
        color: 'var(--purple-dark)', cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
        fontWeight: 600, alignSelf: 'flex-start',
      }}>
        + {isAr ? 'إضافة نوع مساحة آخر' : 'Add another size type'}
      </button>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export function ResidentialTab({ formData, onChange }: ResidentialTabProps) {
  const t    = useTranslations('easyStart');
  const ti   = useTranslations('easyStart.integrated');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const set = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  const resType        = (formData.residentialType as ResType) || 'villas';
  const showVillas     = resType === 'villas'     || resType === 'mixed';
  const showApartments = resType === 'apartments' || resType === 'mixed';

  /* ── area entries ── */
  const [villaEntries, setVillaEntriesLocal] = useState<AreaEntry[]>(
    () => parseAreaEntries(formData.villaTypes)
  );
  const [aptEntries, setAptEntriesLocal] = useState<AreaEntry[]>(
    () => parseAreaEntries(formData.apartmentTypes)
  );

  const setVillaEntries = (entries: AreaEntry[]) => {
    setVillaEntriesLocal(entries);
    onChange({ ...formData, villaTypes: JSON.stringify(entries) });
  };
  const setAptEntries = (entries: AreaEntry[]) => {
    setAptEntriesLocal(entries);
    onChange({ ...formData, apartmentTypes: JSON.stringify(entries) });
  };

  /* ── floor ratio entries ── */
  const villaRatio = useFloorRatio(formData, onChange, 'villaUniformRatio', 'villaUniformRatioValue', 'villaFloorRatios');
  const aptRatio   = useFloorRatio(formData, onChange, 'aptUniformRatio',   'aptUniformRatioValue',   'aptFloorRatios');

  return (
    <div className="easy-tab-content">

      {/* ── Residential type ── */}
      <div className="easy-form-group" style={{ marginBottom: '16px' }}>
        <label className="easy-form-label">
          {ti('residentialType')} <Req t={t} />
        </label>
        <div className="easy-res-type-grid">
          {(['villas', 'apartments', 'mixed'] as ResType[]).map(rt => (
            <button key={rt} type="button"
              className={`easy-res-type-btn ${resType === rt ? 'sel' : ''}`}
              onClick={() => set('residentialType', rt)}>
              <span className="easy-res-type-icon">
                {rt === 'villas' ? '🏡' : rt === 'apartments' ? '🏢' : '🏘️'}
              </span>
              <span className="easy-res-type-name">
                {rt === 'villas' ? ti('villas') : rt === 'apartments' ? ti('apartments') : ti('mixedResidential')}
              </span>
              {rt === 'mixed' && (
                <span className="easy-res-type-sub">{ti('mixedResidentialSub')}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Building status ── */}
      <div className="easy-form-group" style={{ marginBottom: '16px' }}>
        <label className="easy-form-label">
          {ti('buildingStatus')} <Req t={t} />
        </label>
        <div className="easy-unit-toggle">
          <button type="button"
            className={`easy-unit-btn ${formData.residentialBuildingStatus !== 'shared' ? 'active' : ''}`}
            onClick={() => set('residentialBuildingStatus', 'standalone')}>
            {ti('standalone')}
          </button>
          <button type="button"
            className={`easy-unit-btn ${formData.residentialBuildingStatus === 'shared' ? 'active' : ''}`}
            onClick={() => set('residentialBuildingStatus', 'shared')}>
            {ti('sharedBuilding')}
          </button>
        </div>
        {formData.residentialBuildingStatus === 'shared' && (
          <p className="easy-field-hint" style={{ marginTop: '6px' }}>
            💡 {ti('sharedBuildingNote')}
          </p>
        )}
      </div>

      {/* ══ VILLAS ══════════════════════════════════════════════════════════ */}
      {showVillas && (
        <>
          <div className="easy-form-section-title">🏡 {ti('villas')}</div>

          <div className="easy-form-group" style={{ marginBottom: '12px' }}>
            <label className="easy-form-label" style={{ marginBottom: '8px', display: 'block' }}>
              {ti('villaCount')} &amp; {ti('villaArea')} <Req t={t} />
            </label>
            <AreaList
              entries={villaEntries}
              onChange={setVillaEntries}
              countLabel={ti('villaCount')}
              areaLabel={ti('villaArea')}
              isAr={isAr}
            />
          </div>

          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('villaFloors')} <Req t={t} />
              </label>
              <input type="text" className="easy-form-input"
                placeholder={isAr ? 'مثال: أرضي + 1' : 'e.g. Ground + 1'}
                value={formData.villaFloors || ''}
                onChange={e => set('villaFloors', e.target.value)} />
            </div>
            <div className="easy-form-group" />
          </div>

          <FloorRatioList
            isAr={isAr}
            uniform={villaRatio.uniform}
            uniformRatio={formData.villaUniformRatioValue || ''}
            entries={villaRatio.floorEntries}
            onUniformChange={villaRatio.onUniformChange}
            onUniformRatioChange={villaRatio.onUniformRatioChange}
            onEntriesChange={villaRatio.setFloorEntries}
          />
        </>
      )}

      {/* ══ APARTMENTS ══════════════════════════════════════════════════════ */}
      {showApartments && (
        <>
          <div className="easy-form-section-title" style={{ marginTop: showVillas ? '20px' : '0' }}>
            🏢 {ti('apartments')}
          </div>

          <div className="easy-form-group" style={{ marginBottom: '12px' }}>
            <label className="easy-form-label" style={{ marginBottom: '8px', display: 'block' }}>
              {ti('apartmentBuildingCount')} &amp; {ti('apartmentBuildingArea')} <Req t={t} />
            </label>
            <AreaList
              entries={aptEntries}
              onChange={setAptEntries}
              countLabel={ti('apartmentBuildingCount')}
              areaLabel={ti('apartmentBuildingArea')}
              isAr={isAr}
            />
          </div>

          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('apartmentFloors')} <Req t={t} />
              </label>
              <input type="text" className="easy-form-input"
                placeholder={isAr ? 'مثال: أرضي + 8' : 'e.g. Ground + 8'}
                value={formData.apartmentFloors || ''}
                onChange={e => set('apartmentFloors', e.target.value)} />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {ti('unitsPerFloor')} <Opt t={t} />
              </label>
              <input type="number" min="1" className="easy-form-input"
                placeholder={isAr ? 'مثال: 4' : 'e.g. 4'}
                value={formData.unitsPerFloor || ''}
                onChange={e => set('unitsPerFloor', e.target.value)} />
            </div>
          </div>

          <FloorRatioList
            isAr={isAr}
            uniform={aptRatio.uniform}
            uniformRatio={formData.aptUniformRatioValue || ''}
            entries={aptRatio.floorEntries}
            onUniformChange={aptRatio.onUniformChange}
            onUniformRatioChange={aptRatio.onUniformRatioChange}
            onEntriesChange={aptRatio.setFloorEntries}
          />
        </>
      )}

      <p className="easy-field-hint" style={{ marginTop: '14px' }}>
        📄 {ti('uploadLicenseHint')}
      </p>
    </div>
  );
}
