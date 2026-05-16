'use client';

import { useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

/* ─── Types ─── */
type BuildingType = 'residential' | 'commercial' | 'administrative' | 'mixed';
type LicenseType  = 'residential' | 'commercial' | 'administrative' | 'industrial' | 'tourism';

interface FilePreview { name: string; url: string; size: string; }

function fmtSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const BUILDING_TYPES: { key: BuildingType; icon: string; labelAr: string; labelEn: string }[] = [
  { key: 'residential',    icon: '🏠', labelAr: 'سكني',          labelEn: 'Residential'    },
  { key: 'commercial',     icon: '🏪', labelAr: 'تجاري',         labelEn: 'Commercial'     },
  { key: 'administrative', icon: '🏢', labelAr: 'إداري',         labelEn: 'Administrative' },
  { key: 'mixed',          icon: '🏙️', labelAr: 'متعدد الأنشطة', labelEn: 'Mixed-Use'      },
];

const LICENSE_TYPES: { key: LicenseType; labelAr: string; labelEn: string }[] = [
  { key: 'residential',    labelAr: 'سكني',   labelEn: 'Residential'    },
  { key: 'commercial',     labelAr: 'تجاري',  labelEn: 'Commercial'     },
  { key: 'administrative', labelAr: 'إداري',  labelEn: 'Administrative' },
  { key: 'industrial',     labelAr: 'صناعي',  labelEn: 'Industrial'     },
  { key: 'tourism',        labelAr: 'سياحي',  labelEn: 'Tourism'        },
];

const Req = ({ isAr }: { isAr: boolean }) => (
  <span style={{ color: '#e74c3c', marginInlineStart: '4px' }}>*</span>
);

function FileStrip({ files, onRemove, isImage }: { files: FilePreview[]; onRemove: (i: number) => void; isImage: boolean }) {
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
            <div style={{ padding: '6px 10px', background: '#f4f7fb', fontSize: '11px' }}>
              <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1e3a5f' }}>{f.name}</div>
              <div style={{ color: '#888', marginTop: '2px' }}>{f.size}</div>
            </div>
          )}
          <button onClick={() => onRemove(i)} style={{
            position: 'absolute', top: 2, left: 2, width: '18px', height: '18px',
            borderRadius: '50%', background: 'rgba(0,0,0,0.55)', color: 'white',
            border: 'none', cursor: 'pointer', fontSize: '10px', lineHeight: '18px', textAlign: 'center',
          }}>✕</button>
        </div>
      ))}
    </div>
  );
}

export function SalesStudyPage() {
  const t = useTranslations('easyStart');
  const locale = useLocale();
  const isAr = locale === 'ar';

  /* ── form state ── */
  const [buildingType,  setBuildingType]  = useState<BuildingType | null>(null);
  const [licenseType,   setLicenseType]   = useState<LicenseType | ''>('');
  const [governorate,   setGovernorate]   = useState('');
  const [district,      setDistrict]      = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [totalArea,     setTotalArea]     = useState('');
  const [sellableArea,  setSellableArea]  = useState('');
  const [floorCount,    setFloorCount]    = useState('');
  const [areaPerFloor,  setAreaPerFloor]  = useState('');
  const [unitCount,     setUnitCount]     = useState('');
  const [buildingAge,   setBuildingAge]   = useState('');
  const [finishLevel,   setFinishLevel]   = useState('');
  const [targetPrice,   setTargetPrice]   = useState('');
  const [paymentTerms,  setPaymentTerms]  = useState('');
  const [notes,         setNotes]         = useState('');

  const [photos,   setPhotos]   = useState<FilePreview[]>([]);
  const [docFiles, setDocFiles] = useState<FilePreview[]>([]);

  const photoRef = useRef<HTMLInputElement>(null);
  const docRef   = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null, setter: React.Dispatch<React.SetStateAction<FilePreview[]>>) {
    if (!files) return;
    Array.from(files).forEach(f => {
      setter(prev => [...prev, { name: f.name, url: URL.createObjectURL(f), size: fmtSize(f.size) }]);
    });
  }

  /* ── validation ── */
  const canGenerate =
    !!buildingType &&
    !!licenseType &&
    governorate.trim() !== '' &&
    totalArea.trim() !== '' &&
    sellableArea.trim() !== '' &&
    floorCount.trim() !== '' &&
    unitCount.trim() !== '' &&
    photos.length > 0 &&
    docFiles.length > 0;

  const hint = !buildingType
    ? (isAr ? 'اختر نوع المبنى أولاً' : 'Select the building type first')
    : !licenseType
    ? (isAr ? 'اختر نوع الترخيص' : 'Select the license type')
    : !governorate.trim()
    ? (isAr ? 'أدخل المحافظة' : 'Enter the governorate')
    : !totalArea.trim()
    ? (isAr ? 'أدخل إجمالي مساحة المبنى' : 'Enter the total building area')
    : !sellableArea.trim()
    ? (isAr ? 'أدخل المساحة القابلة للبيع' : 'Enter the sellable area')
    : !floorCount.trim()
    ? (isAr ? 'أدخل عدد الأدوار' : 'Enter the number of floors')
    : !unitCount.trim()
    ? (isAr ? 'أدخل عدد الوحدات / المحلات' : 'Enter the unit / shop count')
    : photos.length === 0
    ? (isAr ? 'أرفع صور المبنى (مطلوب)' : 'Upload building photos (required)')
    : (isAr ? 'أرفع مستندات الملكية (مطلوب)' : 'Upload ownership documents (required)');

  /* ── section header ── */
  const SectionTitle = ({ label }: { label: string }) => (
    <div className="easy-section-title" style={{ marginBottom: '10px', marginTop: '20px' }}>
      {label}
    </div>
  );

  const lbl = (ar: string, en: string) => isAr ? ar : en;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div className="easy-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" className="easy-back-btn">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
          </Link>
          <div>
            <div className="easy-page-title">{t('salesStudyTitle')}</div>
            <div className="easy-page-sub">{t('salesStudySub')}</div>
          </div>
        </div>
      </div>

      <div className="easy-content">
        <div className="easy-new-study-wrap">

          {/* ── Building Type ── */}
          <SectionTitle label={lbl('نوع المبنى', 'Building Type')} />
          <div className="easy-subtype-grid">
            {BUILDING_TYPES.map(({ key, icon, labelAr, labelEn }) => (
              <button
                key={key}
                className={`easy-subtype-btn ${buildingType === key ? 'sel' : ''}`}
                onClick={() => setBuildingType(key)}
              >
                <span className="easy-subtype-icon">{icon}</span>
                <span className="easy-subtype-name">{isAr ? labelAr : labelEn}</span>
              </button>
            ))}
          </div>

          {/* ── License Type ── */}
          <SectionTitle label={lbl('نوع الترخيص', 'License Type')} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
            {LICENSE_TYPES.map(({ key, labelAr, labelEn }) => {
              const sel = licenseType === key;
              return (
                <button key={key} onClick={() => setLicenseType(key)} style={{
                  padding: '7px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
                  border: `1.5px solid ${sel ? 'var(--purple)' : 'var(--border-dark)'}`,
                  background: sel ? 'var(--purple-light)' : '#fff',
                  color: sel ? 'var(--purple-dark)' : 'var(--text)',
                  fontWeight: sel ? 700 : 500, transition: 'all 0.15s',
                  fontFamily: 'Cairo, sans-serif',
                }}>
                  {isAr ? labelAr : labelEn}
                  {sel && ' ✓'}
                </button>
              );
            })}
          </div>

          {/* ── Location ── */}
          <SectionTitle label={lbl('الموقع', 'Location')} />
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {lbl('المحافظة', 'Governorate')} <Req isAr={isAr} />
              </label>
              <input
                className="easy-form-input"
                placeholder={lbl('مثال: القاهرة', 'e.g. Cairo')}
                value={governorate}
                onChange={e => setGovernorate(e.target.value)}
              />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {lbl('الحي / المنطقة', 'District / Area')}
              </label>
              <input
                className="easy-form-input"
                placeholder={lbl('مثال: مدينة نصر', 'e.g. Nasr City')}
                value={district}
                onChange={e => setDistrict(e.target.value)}
              />
            </div>
          </div>
          <div className="easy-form-group" style={{ marginBottom: '4px' }}>
            <label className="easy-form-label">
              {lbl('عنوان الشارع', 'Street Address')}
            </label>
            <input
              className="easy-form-input"
              placeholder={lbl('مثال: شارع التحرير، بجوار البنك الأهلي', 'e.g. 5 Tahrir St., next to National Bank')}
              value={streetAddress}
              onChange={e => setStreetAddress(e.target.value)}
            />
          </div>

          {/* ── Building Areas ── */}
          <SectionTitle label={lbl('مساحات المبنى', 'Building Areas')} />
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {lbl('إجمالي مساحة المبنى (م²)', 'Total Building Area (m²)')} <Req isAr={isAr} />
              </label>
              <input type="number" className="easy-form-input" placeholder="0"
                value={totalArea} onChange={e => setTotalArea(e.target.value)} />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {lbl('المساحة القابلة للبيع / التأجير (م²)', 'Sellable / Rentable Area (m²)')} <Req isAr={isAr} />
              </label>
              <input type="number" className="easy-form-input" placeholder="0"
                value={sellableArea} onChange={e => setSellableArea(e.target.value)} />
            </div>
          </div>
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {lbl('عدد الأدوار', 'Number of Floors')} <Req isAr={isAr} />
              </label>
              <input type="number" className="easy-form-input" placeholder="0"
                value={floorCount} onChange={e => setFloorCount(e.target.value)} />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {lbl('متوسط مساحة الدور (م²)', 'Avg. Floor Area (m²)')}
              </label>
              <input type="number" className="easy-form-input" placeholder="0"
                value={areaPerFloor} onChange={e => setAreaPerFloor(e.target.value)} />
            </div>
          </div>

          {/* ── Building Details ── */}
          <SectionTitle label={lbl('تفاصيل المبنى', 'Building Details')} />
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {lbl('عدد الوحدات / المحلات', 'Unit / Shop Count')} <Req isAr={isAr} />
              </label>
              <input type="number" className="easy-form-input" placeholder="0"
                value={unitCount} onChange={e => setUnitCount(e.target.value)} />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {lbl('عمر المبنى (سنوات)', 'Building Age (years)')}
              </label>
              <input type="number" className="easy-form-input" placeholder="0"
                value={buildingAge} onChange={e => setBuildingAge(e.target.value)} />
            </div>
          </div>
          <div className="easy-form-group" style={{ marginBottom: '4px' }}>
            <label className="easy-form-label">
              {lbl('مستوى التشطيب', 'Finish Level')}
            </label>
            <select className="easy-form-input" value={finishLevel} onChange={e => setFinishLevel(e.target.value)}>
              <option value="">{lbl('اختر مستوى التشطيب', 'Select finish level')}</option>
              <option value="بدون تشطيب">{lbl('بدون تشطيب', 'Shell & Core')}</option>
              <option value="تشطيب عادي">{lbl('تشطيب عادي', 'Standard Finish')}</option>
              <option value="تشطيب متوسط">{lbl('تشطيب متوسط', 'Medium Finish')}</option>
              <option value="تشطيب راقي">{lbl('تشطيب راقي', 'Premium Finish')}</option>
              <option value="تشطيب فندقي">{lbl('تشطيب فندقي', 'Luxury Finish')}</option>
            </select>
          </div>

          {/* ── Pricing ── */}
          <SectionTitle label={lbl('التسعير المستهدف', 'Target Pricing')} />
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                {lbl('سعر البيع المستهدف (جنيه/م²)', 'Target Sale Price (EGP/m²)')}
              </label>
              <input type="number" className="easy-form-input" placeholder="0"
                value={targetPrice} onChange={e => setTargetPrice(e.target.value)} />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                {lbl('شروط الدفع / خطة التقسيط', 'Payment Terms / Installment Plan')}
              </label>
              <input className="easy-form-input"
                placeholder={lbl('مثال: 20% مقدم + 36 قسط', 'e.g. 20% down + 36 installments')}
                value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} />
            </div>
          </div>

          {/* ── Notes ── */}
          <div className="easy-form-group" style={{ marginTop: '4px' }}>
            <label className="easy-form-label">
              {lbl('ملاحظات إضافية', 'Additional Notes')}
            </label>
            <textarea className="easy-form-input" rows={3} style={{ resize: 'vertical' }}
              placeholder={lbl('أي تفاصيل إضافية عن المشروع أو خطة البيع...', 'Any additional details about the project or sales plan...')}
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          {/* ── Photos (required) ── */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e3a5f' }}>
                  📸 {lbl('صور المبنى', 'Building Photos')} <span style={{ color: '#e74c3c' }}>*</span>
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  {lbl('ارفع صوراً واضحة للواجهة والمداخل والوحدات', 'Upload clear photos of the façade, entrances, and units')}
                </div>
              </div>
              <button onClick={() => photoRef.current?.click()} style={{
                padding: '7px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer',
                border: '1.5px solid #1e3a5f', background: 'white', color: '#1e3a5f',
              }}>
                + {lbl('إضافة صور', 'Add Photos')}
              </button>
              <input ref={photoRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={e => addFiles(e.target.files, setPhotos)} />
            </div>
            <FileStrip files={photos} onRemove={i => setPhotos(prev => prev.filter((_, idx) => idx !== i))} isImage={true} />
          </div>

          {/* ── Ownership Docs (required) ── */}
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e3a5f' }}>
                  📎 {lbl('مستندات الملكية', 'Ownership Documents')} <span style={{ color: '#e74c3c' }}>*</span>
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  {lbl('عقد الملكية، الرسم المعماري، رخصة البناء', 'Title deed, architectural drawings, building permit')}
                </div>
              </div>
              <button onClick={() => docRef.current?.click()} style={{
                padding: '7px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer',
                border: '1.5px solid var(--purple)', background: 'white', color: 'var(--purple)',
              }}>
                + {lbl('إضافة مستندات', 'Add Documents')}
              </button>
              <input ref={docRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.dwg" multiple style={{ display: 'none' }}
                onChange={e => addFiles(e.target.files, setDocFiles)} />
            </div>
            <FileStrip files={docFiles} onRemove={i => setDocFiles(prev => prev.filter((_, idx) => idx !== i))} isImage={false} />
          </div>

          {/* ── Hint ── */}
          {!canGenerate && (
            <div style={{
              marginTop: '16px', padding: '10px 14px', borderRadius: '8px',
              background: '#FFFDE7', border: '1.5px solid #F9A825',
              fontSize: '12px', color: '#7c6100', display: 'flex', gap: '8px', alignItems: 'center',
            }}>
              <span>⚠️</span><span>{hint}</span>
            </div>
          )}

          {/* ── Generate ── */}
          <div className="easy-btn-row" style={{ marginTop: '16px' }}>
            <button
              className="easy-btn-primary"
              disabled={!canGenerate}
              style={{ opacity: canGenerate ? 1 : 0.45 }}
              onClick={() => {}}
            >
              📊 {lbl('إنشاء الدراسة البيعية', 'Generate Sales Study')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
