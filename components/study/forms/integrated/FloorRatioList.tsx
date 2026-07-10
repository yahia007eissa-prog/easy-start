'use client';

import { useState } from 'react';

/* ─── types ─────────────────────────────────────────────────────────────────── */
export interface FloorEntry { name: string; ratio: string; }
const EMPTY_FLOOR: FloorEntry = { name: '', ratio: '' };

export const FLOOR_NAMES_AR = [
  'بدروم ١', 'بدروم ٢', 'بدروم ٣',
  'أرضي',
  'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس',
  'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
  'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر',
  'روف',
];
export const FLOOR_NAMES_EN = [
  'Basement 1', 'Basement 2', 'Basement 3',
  'Ground',
  '1st', '2nd', '3rd', '4th', '5th',
  '6th', '7th', '8th', '9th', '10th',
  '11th', '12th', '13th', '14th', '15th',
  'Roof',
];

export function parseFloorEntries(raw: string | undefined): FloorEntry[] {
  if (!raw) return [{ ...EMPTY_FLOOR }];
  try { const p = JSON.parse(raw); return Array.isArray(p) && p.length ? p : [{ ...EMPTY_FLOOR }]; }
  catch { return [{ ...EMPTY_FLOOR }]; }
}

/* ─── FloorRatioList component ───────────────────────────────────────────────── */
export function FloorRatioList({ isAr, uniform, uniformRatio, entries, onUniformChange, onUniformRatioChange, onEntriesChange }: {
  isAr: boolean;
  uniform: boolean;
  uniformRatio: string;
  entries: FloorEntry[];
  onUniformChange: (v: boolean) => void;
  onUniformRatioChange: (v: string) => void;
  onEntriesChange: (e: FloorEntry[]) => void;
}) {
  const floorNames = isAr ? FLOOR_NAMES_AR : FLOOR_NAMES_EN;

  const upd = (i: number, f: keyof FloorEntry, v: string) =>
    onEntriesChange(entries.map((e, idx) => idx === i ? { ...e, [f]: v } : e));
  const rm  = (i: number) => onEntriesChange(entries.filter((_, idx) => idx !== i));
  const add = ()           => onEntriesChange([...entries, { ...EMPTY_FLOOR }]);

  const lbl = (ar: string, en: string) => isAr ? ar : en;

  return (
    <div style={{
      background: 'var(--purple-faint)', border: '1.5px solid var(--purple-border)',
      borderRadius: '10px', padding: '14px 16px', marginTop: '4px',
    }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--purple-dark)', marginBottom: '10px' }}>
        📐 {lbl('الاشتراطات البنائية — النسب على مساحة الأرض', 'Building Ratios per Floor')}
      </div>

      {/* Toggle */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', color: '#555', marginBottom: '6px' }}>
          {lbl('هل كل الأدوار بنفس النسبة البنائية؟', 'Are all floors the same building ratio?')}
        </div>
        <div className="easy-unit-toggle" style={{ width: 'fit-content' }}>
          <button type="button"
            className={`easy-unit-btn ${uniform ? 'active' : ''}`}
            onClick={() => onUniformChange(true)}
            style={{ fontSize: '12px', padding: '5px 16px' }}>
            {lbl('نعم', 'Yes')}
          </button>
          <button type="button"
            className={`easy-unit-btn ${!uniform ? 'active' : ''}`}
            onClick={() => onUniformChange(false)}
            style={{ fontSize: '12px', padding: '5px 16px' }}>
            {lbl('لا — مختلفة', 'No — varies')}
          </button>
        </div>
      </div>

      {/* Uniform: one ratio for all */}
      {uniform && (
        <div className="easy-form-group" style={{ marginBottom: 0, maxWidth: '220px' }}>
          <label className="easy-form-label" style={{ fontSize: '12px' }}>
            {lbl('نسبة البناء لجميع الأدوار (%)', 'Building ratio — all floors (%)')}
          </label>
          <input type="number" min="1" max="100" className="easy-form-input"
            placeholder={lbl('مثال: 65', 'e.g. 65')}
            value={uniformRatio}
            onChange={e => onUniformRatioChange(e.target.value)} />
        </div>
      )}

      {/* Non-uniform: floor by floor */}
      {!uniform && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entries.map((entry, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-end', gap: '10px',
              background: '#fff', borderRadius: '8px', padding: '10px 12px',
              border: '1.5px solid #e2e8f0',
            }}>
              <div className="easy-form-group" style={{ flex: 2, marginBottom: 0 }}>
                <label className="easy-form-label" style={{ fontSize: '11px' }}>
                  {lbl('الدور', 'Floor')}
                </label>
                <select className="easy-form-input" value={entry.name}
                  onChange={e => upd(i, 'name', e.target.value)}>
                  <option value="">{lbl('اختر الدور', 'Select floor')}</option>
                  {floorNames.map(fn => (
                    <option key={fn} value={fn}>{fn}</option>
                  ))}
                </select>
              </div>

              <div className="easy-form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="easy-form-label" style={{ fontSize: '11px' }}>
                  {lbl('النسبة البنائية %', 'Ratio %')}
                </label>
                <input type="number" min="1" max="100" className="easy-form-input"
                  placeholder={lbl('مثال: 65', 'e.g. 65')}
                  value={entry.ratio}
                  onChange={e => upd(i, 'ratio', e.target.value)} />
              </div>

              {entries.length > 1 && (
                <button type="button" onClick={() => rm(i)}
                  title={lbl('حذف', 'Remove')}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    border: '1.5px solid #e74c3c', background: 'white',
                    color: '#e74c3c', cursor: 'pointer', fontSize: '13px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '2px', flexShrink: 0,
                  }}>✕</button>
              )}
            </div>
          ))}

          <button type="button" onClick={add} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '8px', fontSize: '12px',
            border: '1.5px dashed var(--purple)', background: 'white',
            color: 'var(--purple-dark)', cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
            fontWeight: 600, alignSelf: 'flex-start',
          }}>
            + {lbl('إضافة دور', 'Add floor')}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── useFloorRatio hook ─────────────────────────────────────────────────────── */
export function useFloorRatio(
  formData: Record<string, string>,
  onChange: (data: Record<string, string>) => void,
  uniformKey: string,
  uniformValueKey: string,
  ratiosKey: string,
) {
  const [floorEntries, setFloorEntriesLocal] = useState<FloorEntry[]>(
    () => parseFloorEntries(formData[ratiosKey])
  );

  const setFloorEntries = (entries: FloorEntry[]) => {
    setFloorEntriesLocal(entries);
    onChange({ ...formData, [ratiosKey]: JSON.stringify(entries) });
  };

  const uniform = formData[uniformKey] === 'true';

  const onUniformChange = (v: boolean) =>
    onChange({ ...formData, [uniformKey]: v ? 'true' : 'false' });

  const onUniformRatioChange = (v: string) =>
    onChange({ ...formData, [uniformValueKey]: v });

  return { floorEntries, setFloorEntries, uniform, onUniformChange, onUniformRatioChange };
}
