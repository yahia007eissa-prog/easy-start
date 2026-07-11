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

/* ─── basement extra works (إحلال / شير وول / خوازيق) ──────────────────────── */
const BASEMENT_FLOOR_NAMES = new Set([
  'بدروم ١', 'بدروم ٢', 'بدروم ٣', 'Basement 1', 'Basement 2', 'Basement 3',
]);

export const BASEMENT_EXTRA_ITEMS: { key: string; ar: string; en: string }[] = [
  { key: 'soil_replacement', ar: 'أعمال الإحلال', en: 'Soil Replacement' },
  { key: 'shear_wall',       ar: 'شير وول (حوائط استنادية)', en: 'Shear Wall' },
  { key: 'piles',            ar: 'الخوازيق', en: 'Piles' },
];

export function parseBasementExtras(raw: string | undefined): string[] {
  if (!raw) return [];
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; }
  catch { return []; }
}

/* ─── FloorRatioList component ───────────────────────────────────────────────── */
export function FloorRatioList({
  isAr, uniform, uniformRatio, entries, onUniformChange, onUniformRatioChange, onEntriesChange,
  basementExtras, onBasementExtrasChange,
}: {
  isAr: boolean;
  uniform: boolean;
  uniformRatio: string;
  entries: FloorEntry[];
  onUniformChange: (v: boolean) => void;
  onUniformRatioChange: (v: string) => void;
  onEntriesChange: (e: FloorEntry[]) => void;
  basementExtras?: string[];
  onBasementExtrasChange?: (v: string[]) => void;
}) {
  const floorNames = isAr ? FLOOR_NAMES_AR : FLOOR_NAMES_EN;

  const upd = (i: number, f: keyof FloorEntry, v: string) =>
    onEntriesChange(entries.map((e, idx) => idx === i ? { ...e, [f]: v } : e));
  const rm  = (i: number) => onEntriesChange(entries.filter((_, idx) => idx !== i));
  const add = ()           => onEntriesChange([...entries, { ...EMPTY_FLOOR }]);

  const lbl = (ar: string, en: string) => isAr ? ar : en;

  // Basement extras only make sense once the user has actually picked a basement
  // floor in the per-floor breakdown — "uniform ratio" mode has no floor identity.
  const hasBasement = !uniform && entries.some(e => BASEMENT_FLOOR_NAMES.has(e.name));
  const toggleExtra = (key: string) => {
    if (!onBasementExtrasChange) return;
    const cur = basementExtras || [];
    onBasementExtrasChange(cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key]);
  };

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

      {/* Basement extra works — only shown once a basement floor is actually selected above */}
      {hasBasement && (
        <div style={{
          marginTop: '14px', paddingTop: '12px', borderTop: '1.5px dashed var(--purple-border)',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--purple-dark)', marginBottom: '8px' }}>
            🧱 {lbl('أعمال إضافية بالبدروم (اختياري)', 'Extra Basement Works (optional)')}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
            {lbl('اختر البنود المطلوبة فعليًا في هذا المشروع فقط', 'Select only the items actually required for this project')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {BASEMENT_EXTRA_ITEMS.map(item => {
              const checked = (basementExtras || []).includes(item.key);
              return (
                <label key={item.key} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                  fontSize: '12px', background: checked ? 'var(--purple-faint)' : '#fff',
                  border: `1.5px solid ${checked ? 'var(--purple)' : '#e2e8f0'}`,
                  borderRadius: '8px', padding: '6px 12px',
                }}>
                  <input type="checkbox" checked={checked} onChange={() => toggleExtra(item.key)} />
                  {lbl(item.ar, item.en)}
                </label>
              );
            })}
          </div>
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
  basementExtrasKey?: string,
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

  const basementExtras = basementExtrasKey ? parseBasementExtras(formData[basementExtrasKey]) : [];

  const onBasementExtrasChange = (v: string[]) => {
    if (!basementExtrasKey) return;
    onChange({ ...formData, [basementExtrasKey]: JSON.stringify(v) });
  };

  return {
    floorEntries, setFloorEntries, uniform, onUniformChange, onUniformRatioChange,
    basementExtras, onBasementExtrasChange,
  };
}
