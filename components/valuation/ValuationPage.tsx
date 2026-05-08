'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { generateValuation, type ValuationFormData } from '@/app/actions/valuation';
import Link from 'next/link';

type PropType = 'agriLand' | 'urbanLand' | 'apartment' | 'commercial' | 'fullEstate';
type Condition = 'excellent' | 'good' | 'average' | 'needsMaint';

const PROP_TYPES: { key: PropType; icon: string }[] = [
  { key: 'agriLand',   icon: '🌾' },
  { key: 'urbanLand',  icon: '🏗️' },
  { key: 'apartment',  icon: '🏠' },
  { key: 'commercial', icon: '🏪' },
  { key: 'fullEstate', icon: '🏢' },
];

const CONDITIONS: { key: Condition; icon: string }[] = [
  { key: 'excellent',  icon: '✨' },
  { key: 'good',       icon: '👍' },
  { key: 'average',    icon: '➖' },
  { key: 'needsMaint', icon: '🔧' },
];

const UTILITIES = ['الكهرباء', 'المياه', 'الغاز', 'مستندات موثقة'];
const ROAD_TYPES = [
  { key: 'main',    label: 'طريق رئيسي',  icon: '🛣️' },
  { key: 'side',    label: 'طريق فرعي',   icon: '🛤️' },
  { key: 'unpaved', label: 'مدق (غير مسفلت)', icon: '🌿' },
  { key: 'none',    label: 'لا يوجد طريق', icon: '❌' },
];

export function ValuationPage() {
  const t = useTranslations('easyStart');

  const [propType,    setPropType]    = useState<PropType | null>(null);
  const [location,    setLocation]    = useState('');
  const [area,        setArea]        = useState('');
  const [areaUnit,    setAreaUnit]    = useState('sqm');
  const [condition,   setCondition]   = useState<Condition | null>(null);
  const [utilities,   setUtilities]   = useState<string[]>([]);
  const [roadType,    setRoadType]    = useState<string>('');
  const [floor,       setFloor]       = useState('');
  const [buildingAge, setBuildingAge] = useState('');
  const [finishLevel, setFinishLevel] = useState('');
  const [notes,       setNotes]       = useState('');

  const [isLoading,  setIsLoading]  = useState(false);
  const [report,     setReport]     = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  const toggleUtility = (u: string) =>
    setUtilities(prev => prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u]);

  const canGenerate = !!propType && location.trim() && area.trim() && !!condition;

  const handleGenerate = async () => {
    if (!canGenerate || isLoading) return;
    setIsLoading(true);
    setError(null);
    setReport(null);

    const data: ValuationFormData = {
      propType:    propType!,
      location,
      area,
      areaUnit,
      condition:   condition!,
      utilities: roadType ? [...utilities, `نوع الطريق: ${ROAD_TYPES.find(r => r.key === roadType)?.label ?? roadType}`] : utilities,
      floor,
      buildingAge,
      finishLevel,
      notes,
    };

    const res = await generateValuation(data);
    if (res.success && res.reportText) {
      setReport(res.reportText);
    } else {
      setError(res.error ?? t('valuationError'));
    }
    setIsLoading(false);
  };

  return (
    <div>
      {/* Top bar */}
      <div className="easy-topbar">
        <div className="flex items-center gap-3">
          <Link href="/" className="easy-back-btn">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
          </Link>
          <div>
            <div className="easy-page-title">{t('navValuation')}</div>
            <div className="easy-page-sub">{t('valuationSub')}</div>
          </div>
        </div>
      </div>

      <div className="easy-content">
        <div className="easy-screen active">
          <div className="easy-card">
            {!report ? (
              <div className="easy-new-study-wrap">

                {/* Property Type */}
                <div className="easy-section-title" style={{ marginBottom: '10px' }}>
                  {t('valuationPropType')}
                </div>
                <div className="easy-subtype-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
                  {PROP_TYPES.map(({ key, icon }) => (
                    <button
                      key={key}
                      className={`easy-subtype-btn ${propType === key ? 'sel' : ''}`}
                      onClick={() => setPropType(key)}
                    >
                      <span className="easy-subtype-icon">{icon}</span>
                      <span className="easy-subtype-name" style={{ fontSize: '11px' }}>{t(`propType${key.charAt(0).toUpperCase() + key.slice(1)}` as never)}</span>
                    </button>
                  ))}
                </div>

                {/* Location + Area */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                  <div className="easy-form-group">
                    <label className="easy-label">{t('valuationLocation')} <span style={{ color: '#e74c3c' }}>*</span></label>
                    <input
                      className="easy-input"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="مثال: القاهرة الجديدة، التجمع الخامس"
                    />
                  </div>
                  <div className="easy-form-group">
                    <label className="easy-label">{t('valuationArea')} <span style={{ color: '#e74c3c' }}>*</span></label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        className="easy-input"
                        type="number"
                        value={area}
                        onChange={e => setArea(e.target.value)}
                        placeholder="0"
                        style={{ flex: 1 }}
                      />
                      <select className="easy-input" value={areaUnit} onChange={e => setAreaUnit(e.target.value)} style={{ width: '90px' }}>
                        <option value="sqm">م²</option>
                        <option value="feddan">فدان</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Condition */}
                <div className="easy-section-title" style={{ marginTop: '18px', marginBottom: '10px' }}>
                  {t('valuationCondition')}
                </div>
                <div className="easy-method-row">
                  {CONDITIONS.map(({ key, icon }) => (
                    <button
                      key={key}
                      className={`easy-method-card ${condition === key ? 'selected' : ''}`}
                      onClick={() => setCondition(key)}
                      style={{ padding: '12px 10px' }}
                    >
                      <div style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</div>
                      <div className="easy-method-title" style={{ fontSize: '13px' }}>{t(`condition${key.charAt(0).toUpperCase() + key.slice(1)}` as never)}</div>
                    </button>
                  ))}
                </div>

                {/* Utilities (for land types) */}
                {(propType === 'agriLand' || propType === 'urbanLand' || propType === 'fullEstate') && (
                  <>
                    <div className="easy-section-title" style={{ marginTop: '18px', marginBottom: '10px' }}>
                      {t('valuationUtilities')}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      {UTILITIES.map(u => (
                        <button
                          key={u}
                          onClick={() => toggleUtility(u)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: `1.5px solid ${utilities.includes(u) ? '#1e3a5f' : '#ddd'}`,
                            background: utilities.includes(u) ? '#1e3a5f' : 'white',
                            color: utilities.includes(u) ? 'white' : '#555',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          {utilities.includes(u) ? '✓ ' : ''}{u}
                        </button>
                      ))}
                    </div>
                    {/* Road type */}
                    <div style={{ fontSize: '12px', color: '#555', fontWeight: 600, marginBottom: '8px' }}>
                      نوع الطريق المتاح
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {ROAD_TYPES.map(r => (
                        <button
                          key={r.key}
                          onClick={() => setRoadType(prev => prev === r.key ? '' : r.key)}
                          style={{
                            padding: '7px 14px',
                            borderRadius: '8px',
                            border: `1.5px solid ${roadType === r.key ? '#e67e22' : '#ddd'}`,
                            background: roadType === r.key ? '#fef3e2' : 'white',
                            color: roadType === r.key ? '#c0392b' : '#555',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            display: 'flex', alignItems: 'center', gap: '5px',
                          }}
                        >
                          {r.icon} {r.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Apartment extras */}
                {propType === 'apartment' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '16px' }}>
                    <div className="easy-form-group">
                      <label className="easy-label">{t('valuationFloor')}</label>
                      <input className="easy-input" type="number" value={floor} onChange={e => setFloor(e.target.value)} placeholder="3" />
                    </div>
                    <div className="easy-form-group">
                      <label className="easy-label">{t('valuationBuildingAge')}</label>
                      <input className="easy-input" type="number" value={buildingAge} onChange={e => setBuildingAge(e.target.value)} placeholder="10" />
                    </div>
                    <div className="easy-form-group">
                      <label className="easy-label">{t('valuationFinishLevel')}</label>
                      <select className="easy-input" value={finishLevel} onChange={e => setFinishLevel(e.target.value)}>
                        <option value="">اختر المستوى</option>
                        <option value="بدون تشطيب">بدون تشطيب</option>
                        <option value="تشطيب عادي">تشطيب عادي</option>
                        <option value="تشطيب متوسط">تشطيب متوسط</option>
                        <option value="تشطيب راقي">تشطيب راقي</option>
                        <option value="تشطيب فندقي">تشطيب فندقي</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="easy-form-group" style={{ marginTop: '16px' }}>
                  <label className="easy-label">{t('valuationNotes')}</label>
                  <textarea
                    className="easy-input"
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="أي تفاصيل إضافية تساعد في دقة التقييم (مجاورة لمشاريع، قرب من خدمات، مشاكل قانونية، إلخ)"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Generate button */}
                <div className="easy-btn-row">
                  <button
                    className="easy-btn-primary"
                    onClick={handleGenerate}
                    disabled={!canGenerate || isLoading}
                    style={{ opacity: canGenerate && !isLoading ? 1 : 0.45 }}
                  >
                    {isLoading ? (
                      <><span className="easy-spinner" />{t('valuationGenerating')}</>
                    ) : (
                      `⚖️ ${t('valuationGenerate')}`
                    )}
                  </button>
                </div>

                {error && (
                  <div className="easy-error-toast">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="easy-error-dismiss">✕</button>
                  </div>
                )}
              </div>
            ) : (
              /* Report view */
              <div className="easy-new-study-wrap">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e3a5f' }}>
                    ⚖️ {t('valuationResult')}
                  </h2>
                  <button
                    className="easy-btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                    onClick={() => { setReport(null); setError(null); }}
                  >
                    ← تقييم جديد
                  </button>
                </div>
                <div
                  className="easy-study-output"
                  style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '14px', color: '#1a1a2e' }}
                >
                  {report}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
