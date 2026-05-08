'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { generateValuation, type ValuationFormData } from '@/app/actions/valuation';
import Link from 'next/link';

type PropType = 'agriLand' | 'urbanLand' | 'apartment' | 'commercial' | 'fullEstate';
type Condition = 'excellent' | 'good' | 'average' | 'needsMaint';

interface FilePreview { name: string; url: string; size: string; }

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

const UTILITY_ITEMS = [
  { key: 'elec',      labelKey: 'utilityElec',      ar: 'كهرباء'               },
  { key: 'water',     labelKey: 'utilityWater',     ar: 'مياه'                  },
  { key: 'gas',       labelKey: 'utilityGas',       ar: 'غاز'                   },
  { key: 'transport', labelKey: 'utilityTransport', ar: 'قرب من وسائل التنقل'   },
  { key: 'docs',      labelKey: 'utilityDocs',      ar: 'مستندات موثقة'         },
];

const ROAD_AGRI = [
  { key: 'main',    ar: 'طريق رئيسي',       icon: '🛣️' },
  { key: 'side',    ar: 'طريق فرعي',        icon: '🛤️' },
  { key: 'unpaved', ar: 'مدق (غير مسفلت)', icon: '🌿' },
];
const ROAD_URBAN = [
  { key: 'main', ar: 'طريق رئيسي', icon: '🛣️' },
  { key: 'side', ar: 'طريق فرعي',  icon: '🛤️' },
];

function getRoadOptions(p: PropType | null) {
  if (p === 'agriLand')  return ROAD_AGRI;
  if (p === 'urbanLand') return ROAD_URBAN;
  return null;
}

function fmtSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const NEEDS_CONDITION: PropType[] = ['apartment', 'commercial', 'fullEstate'];
const NEEDS_LAND_REQS: PropType[] = ['agriLand', 'urbanLand'];
const NEEDS_UTILITIES: PropType[] = ['agriLand', 'urbanLand', 'fullEstate'];

export function ValuationPage() {
  const t = useTranslations('easyStart');

  const [propType,    setPropType]    = useState<PropType | null>(null);
  const [location,    setLocation]    = useState('');
  const [area,        setArea]        = useState('');
  const [areaUnit,    setAreaUnit]    = useState('sqm');
  const [condition,   setCondition]   = useState<Condition | null>(null);
  const [utilities,   setUtilities]   = useState<string[]>([]);
  const [roadType,    setRoadType]    = useState('');
  const [landReqs,    setLandReqs]    = useState('');
  const [floor,       setFloor]       = useState('');
  const [buildingAge, setBuildingAge] = useState('');
  const [finishLevel, setFinishLevel] = useState('');
  const [notes,       setNotes]       = useState('');

  const [photos,   setPhotos]   = useState<FilePreview[]>([]);
  const [docFiles, setDocFiles] = useState<FilePreview[]>([]);

  const photoRef = useRef<HTMLInputElement>(null);
  const docRef   = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [report,    setReport]    = useState<string | null>(null);
  const [error,     setError]     = useState<string | null>(null);

  const toggleUtility = (key: string) =>
    setUtilities(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);

  function addFiles(files: FileList | null, setter: React.Dispatch<React.SetStateAction<FilePreview[]>>) {
    if (!files) return;
    Array.from(files).forEach(f => {
      const url = URL.createObjectURL(f);
      setter(prev => [...prev, { name: f.name, url, size: fmtSize(f.size) }]);
    });
  }

  const needsCondition = propType ? NEEDS_CONDITION.includes(propType) : false;
  const needsLandReqs  = propType ? NEEDS_LAND_REQS.includes(propType)  : false;
  const needsUtilities = propType ? NEEDS_UTILITIES.includes(propType)  : false;
  const roadOptions    = getRoadOptions(propType);

  const canGenerate =
    !!propType && location.trim() !== '' && area.trim() !== '' &&
    (!needsCondition || !!condition);

  const handleGenerate = async () => {
    if (!canGenerate || isLoading) return;
    setIsLoading(true);
    setError(null);
    setReport(null);

    const utilityLabels = UTILITY_ITEMS.filter(u => utilities.includes(u.key)).map(u => u.ar);
    if (roadType) {
      const r = [...ROAD_AGRI, ...ROAD_URBAN].find(x => x.key === roadType);
      if (r) utilityLabels.push(`نوع الطريق: ${r.ar}`);
    }
    if (landReqs.trim()) utilityLabels.push(`اشتراطات الأرض: ${landReqs.trim()}`);
    if (photos.length)   utilityLabels.push(`صور العقار: ${photos.length} صورة مرفقة`);
    if (docFiles.length) utilityLabels.push(`مستندات مرفقة: ${docFiles.map(d => d.name).join('، ')}`);

    const data: ValuationFormData = {
      propType: propType!, location, area, areaUnit,
      condition: condition ?? 'good',
      utilities: utilityLabels,
      floor, buildingAge, finishLevel, notes,
    };

    const res = await generateValuation(data);
    if (res.success && res.reportText) setReport(res.reportText);
    else setError(res.error ?? t('valuationError'));
    setIsLoading(false);
  };

  /* ── File preview strip ── */
  function FileStrip({
    files, onRemove, isImage,
  }: { files: FilePreview[]; onRemove: (i: number) => void; isImage: boolean }) {
    if (!files.length) return null;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
        {files.map((f, i) => (
          <div key={i} style={{
            position: 'relative', border: '1.5px solid #dde3ea', borderRadius: '8px',
            overflow: 'hidden', width: isImage ? '80px' : 'auto', maxWidth: isImage ? '80px' : '180px',
          }}>
            {isImage ? (
              <img src={f.url} alt={f.name} style={{ width: '80px', height: '64px', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ padding: '6px 10px', background: '#f4f7fb', fontSize: '11px', color: '#1e3a5f' }}>
                <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                <div style={{ color: '#888', marginTop: '2px' }}>{f.size}</div>
              </div>
            )}
            <button
              onClick={() => onRemove(i)}
              style={{
                position: 'absolute', top: 2, left: 2, width: '18px', height: '18px',
                borderRadius: '50%', background: 'rgba(0,0,0,0.55)', color: 'white',
                border: 'none', cursor: 'pointer', fontSize: '10px', lineHeight: '18px', textAlign: 'center',
              }}
            >✕</button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
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
                <div className="easy-section-title" style={{ marginBottom: '10px' }}>{t('valuationPropType')}</div>
                <div className="easy-subtype-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
                  {PROP_TYPES.map(({ key, icon }) => (
                    <button key={key}
                      className={`easy-subtype-btn ${propType === key ? 'sel' : ''}`}
                      onClick={() => { setPropType(key); setCondition(null); setRoadType(''); setUtilities([]); }}
                    >
                      <span className="easy-subtype-icon">{icon}</span>
                      <span className="easy-subtype-name" style={{ fontSize: '11px' }}>
                        {t(`propType${key.charAt(0).toUpperCase() + key.slice(1)}` as never)}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Location + Area */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                  <div className="easy-form-group">
                    <label className="easy-label">{t('valuationLocation')} <span style={{ color: '#e74c3c' }}>*</span></label>
                    <input className="easy-input" value={location} onChange={e => setLocation(e.target.value)}
                      placeholder="مثال: القاهرة الجديدة، التجمع الخامس" />
                  </div>
                  <div className="easy-form-group">
                    <label className="easy-label">{t('valuationArea')} <span style={{ color: '#e74c3c' }}>*</span></label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input className="easy-input" type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="0" style={{ flex: 1 }} />
                      <select className="easy-input" value={areaUnit} onChange={e => setAreaUnit(e.target.value)} style={{ width: '90px' }}>
                        <option value="sqm">م²</option>
                        <option value="feddan">فدان</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Land building requirements */}
                {needsLandReqs && (
                  <div className="easy-form-group" style={{ marginTop: '14px' }}>
                    <label className="easy-label">{t('valuationLandReqs')}</label>
                    <input className="easy-input" value={landReqs} onChange={e => setLandReqs(e.target.value)}
                      placeholder={propType === 'agriLand'
                        ? t('valuationLandReqsAgriPh' as never)
                        : t('valuationLandReqsPh' as never)
                      }
                    />
                  </div>
                )}

                {/* Condition — apartment / commercial / fullEstate only */}
                {needsCondition && (
                  <>
                    <div className="easy-section-title" style={{ marginTop: '18px', marginBottom: '10px' }}>
                      {t('valuationCondition')} <span style={{ color: '#e74c3c' }}>*</span>
                    </div>
                    <div className="easy-method-row">
                      {CONDITIONS.map(({ key, icon }) => (
                        <button key={key}
                          className={`easy-method-card ${condition === key ? 'selected' : ''}`}
                          onClick={() => setCondition(key)} style={{ padding: '12px 10px' }}
                        >
                          <div style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</div>
                          <div className="easy-method-title" style={{ fontSize: '13px' }}>
                            {t(`condition${key.charAt(0).toUpperCase() + key.slice(1)}` as never)}
                          </div>
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
                        <option value="">—</option>
                        <option value="بدون تشطيب">بدون تشطيب</option>
                        <option value="تشطيب عادي">تشطيب عادي</option>
                        <option value="تشطيب متوسط">تشطيب متوسط</option>
                        <option value="تشطيب راقي">تشطيب راقي</option>
                        <option value="تشطيب فندقي">تشطيب فندقي</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Utilities + Road — land & full estate */}
                {needsUtilities && (
                  <>
                    <div className="easy-section-title" style={{ marginTop: '18px', marginBottom: '10px' }}>
                      {t('valuationUtilities')}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                      {UTILITY_ITEMS.map(u => (
                        <button key={u.key} onClick={() => toggleUtility(u.key)} style={{
                          padding: '6px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
                          border: `1.5px solid ${utilities.includes(u.key) ? '#1e3a5f' : '#ddd'}`,
                          background: utilities.includes(u.key) ? '#1e3a5f' : 'white',
                          color: utilities.includes(u.key) ? 'white' : '#555',
                          transition: 'all 0.15s',
                        }}>
                          {utilities.includes(u.key) ? '✓ ' : ''}{t(u.labelKey as never)}
                        </button>
                      ))}
                    </div>
                    {roadOptions && (
                      <>
                        <div style={{ fontSize: '12px', color: '#555', fontWeight: 600, marginBottom: '8px' }}>نوع الطريق المتاح</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {roadOptions.map(r => (
                            <button key={r.key} onClick={() => setRoadType(prev => prev === r.key ? '' : r.key)} style={{
                              padding: '7px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer',
                              border: `1.5px solid ${roadType === r.key ? '#e67e22' : '#ddd'}`,
                              background: roadType === r.key ? '#fef3e2' : 'white',
                              color: roadType === r.key ? '#c0392b' : '#555',
                              transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '5px',
                            }}>
                              {r.icon} {r.ar}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Notes */}
                <div className="easy-form-group" style={{ marginTop: '16px' }}>
                  <label className="easy-label">{t('valuationNotes')}</label>
                  <textarea className="easy-input" rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="أي تفاصيل إضافية تساعد في دقة التقييم (مجاورة لمشاريع، قرب من خدمات، مشاكل قانونية، إلخ)"
                    style={{ resize: 'vertical' }} />
                </div>

                {/* ── Photos (optional — all types) ── */}
                {propType && (
                  <div style={{ marginTop: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e3a5f' }}>
                          📸 {t('valuationPhotos')} <span style={{ color: '#aaa', fontWeight: 400, fontSize: '12px' }}>(اختياري)</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{t('valuationPhotosDesc')}</div>
                      </div>
                      <button onClick={() => photoRef.current?.click()} style={{
                        padding: '7px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer',
                        border: '1.5px solid #1e3a5f', background: 'white', color: '#1e3a5f',
                      }}>
                        + {t('valuationAddPhoto')}
                      </button>
                      <input ref={photoRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                        onChange={e => addFiles(e.target.files, setPhotos)} />
                    </div>
                    <FileStrip files={photos} onRemove={i => setPhotos(prev => prev.filter((_, idx) => idx !== i))} isImage={true} />
                  </div>
                )}

                {/* ── Documents (optional — all types) ── */}
                {propType && (
                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e3a5f' }}>
                          📎 {t('valuationDocs')}
                        </div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{t('valuationDocsDesc')}</div>
                      </div>
                      <button onClick={() => docRef.current?.click()} style={{
                        padding: '7px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer',
                        border: '1.5px solid #27ae60', background: 'white', color: '#27ae60',
                      }}>
                        + {t('valuationAddDocs')}
                      </button>
                      <input ref={docRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple style={{ display: 'none' }}
                        onChange={e => addFiles(e.target.files, setDocFiles)} />
                    </div>
                    <FileStrip files={docFiles} onRemove={i => setDocFiles(prev => prev.filter((_, idx) => idx !== i))} isImage={false} />
                  </div>
                )}

                {/* Generate */}
                <div className="easy-btn-row" style={{ marginTop: '20px' }}>
                  <button className="easy-btn-primary" onClick={handleGenerate}
                    disabled={!canGenerate || isLoading}
                    style={{ opacity: canGenerate && !isLoading ? 1 : 0.45 }}
                  >
                    {isLoading
                      ? <><span className="easy-spinner" />{t('valuationGenerating')}</>
                      : `⚖️ ${t('valuationGenerate')}`
                    }
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
              <div className="easy-new-study-wrap">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e3a5f' }}>⚖️ {t('valuationResult')}</h2>
                  <button className="easy-btn-secondary" style={{ fontSize: '12px', padding: '6px 14px' }}
                    onClick={() => { setReport(null); setError(null); }}>
                    ← تقييم جديد
                  </button>
                </div>
                <div className="easy-study-output"
                  style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '14px', color: '#1a1a2e' }}>
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
