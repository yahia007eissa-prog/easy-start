'use client';

import { useTranslations } from 'next-intl';
import { ImageUploadZone } from './renovation/ImageUploadZone';
import { LocationPicker } from './LocationPicker';

interface FinishingFormProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const UNIT_TYPES = [
  { value: 'apartment',  icon: '🏠',  name: 'شقة سكنية' },
  { value: 'villa',      icon: '🏡',  name: 'فيلا' },
  { value: 'clinic',     icon: '🩺',  name: 'عيادة' },
  { value: 'medical',    icon: '🏥',  name: 'مبنى طبي' },
  { value: 'commercial', icon: '🏬',  name: 'تجاري' },
  { value: 'admin',      icon: '🏢',  name: 'إداري' },
  { value: 'hotel',      icon: '🏨',  name: 'فندقي' },
  { value: 'factory',    icon: '🏭',  name: 'مصنع / صناعي' },
  { value: 'mixed',      icon: '🏗️', name: 'مختلط' },
];

const FINISHING_LEVELS = [
  { value: 'normal',  label: 'عادي',       hint: 'بياض + سيراميك عادي + حمام بسيط' },
  { value: 'medium',  label: 'متوسط',      hint: 'بورسلان + جبس بورد + حمامات متوسطة' },
  { value: 'premium', label: 'راقي',       hint: 'رخام + ديكور + تكييف مركزي + حمامات راقية' },
  { value: 'luxury',  label: 'فندقي فاخر', hint: 'مواد استيراد + أتمتة + كل الكماليات' },
];

const CEILING_HEIGHTS = [
  { value: '2.8', label: '2.8 م' },
  { value: '3.0', label: '3.0 م' },
  { value: '3.2', label: '3.2 م' },
  { value: '3.6', label: '3.6 م — المعيار (الكود المصري)', standard: true },
  { value: '4.0', label: '4.0 م' },
  { value: '4.5', label: '4.5 م' },
  { value: '5.0', label: '5.0 م' },
  { value: 'custom', label: 'ارتفاع مخصص' },
];

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

  const unitType     = formData.finishingUnitType || '';
  const isResidential = unitType === 'apartment' || unitType === 'villa';
  const isClinical    = unitType === 'clinic' || unitType === 'medical';
  const isCommercial  = unitType === 'commercial' || unitType === 'admin' || unitType === 'hotel' || unitType === 'factory';
  const isMixed       = unitType === 'mixed';
  const isConstruction = unitType !== '' && unitType !== 'apartment'; // non-apartment need ceiling height

  const docs: string[] = formData.officialDocs ? JSON.parse(formData.officialDocs) : [];
  const hasDocuments = docs.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── STEP 0: Floor plan upload (TOP) ── */}
      <div className="easy-finishing-docs-wrap">
        <div className="easy-finishing-docs-header">
          <span className="easy-finishing-docs-icon">📐</span>
          <div>
            <p className="easy-finishing-docs-title">ارفع الرسم المساحي</p>
            <p className="easy-finishing-docs-hint">
              ارفع المخطط المعماري أو الرسم المساحي للوحدة — لو رفعته، باقي الحقول تبقى اختيارية لأن الرسم شارح كل حاجة
            </p>
          </div>
        </div>
        <ImageUploadZone
          images={docs}
          onImagesChange={imgs => update('officialDocs', JSON.stringify(imgs))}
        />
        {hasDocuments && (
          <div className="easy-finishing-docs-success easy-fade-in">
            ✅ تم رفع {docs.length} رسم — البيانات اليدوية أصبحت اختيارية
          </div>
        )}
      </div>

      {/* ── Unit type ── */}
      <div>
        <label className="easy-form-label" style={{ display: 'block', marginBottom: '10px' }}>
          نوع الوحدة / المبنى
          {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
        </label>
        <div className="easy-finishing-type-grid">
          {UNIT_TYPES.map(u => (
            <button
              key={u.value}
              type="button"
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
            مستوى التشطيب
            {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
          </label>
          <div className="easy-finishing-level-grid">
            {FINISHING_LEVELS.map(fl => (
              <button
                key={fl.value}
                type="button"
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

      {/* ── Area fields + ceiling height ── */}
      {unitType && (
        <div className="easy-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Ceiling height — for all types */}
          <div className="easy-finishing-ceiling-wrap">
            <div className="easy-form-row">
              <div className="easy-form-group">
                <label className="easy-form-label">
                  ارتفاع الدور (من بلاطة لبلاطة)
                  <OptionalBadge label={t('fieldOptional')} />
                </label>
                <select
                  className="easy-form-input"
                  value={formData.ceilingHeight || ''}
                  onChange={e => update('ceilingHeight', e.target.value)}
                >
                  <option value="">اختر الارتفاع</option>
                  {CEILING_HEIGHTS.map(h => (
                    <option key={h.value} value={h.value}>{h.label}</option>
                  ))}
                </select>
              </div>
              {formData.ceilingHeight === 'custom' && (
                <div className="easy-form-group easy-fade-in">
                  <label className="easy-form-label">
                    الارتفاع بالمتر
                    <RequiredBadge label={t('fieldRequired')} />
                  </label>
                  <input
                    type="text"
                    className="easy-form-input"
                    placeholder="مثال: 4.2"
                    value={formData.ceilingHeightCustom || ''}
                    onChange={e => update('ceilingHeightCustom', e.target.value)}
                  />
                </div>
              )}
            </div>
            {formData.ceilingHeight && formData.ceilingHeight !== '3.6' && formData.ceilingHeight !== 'custom' && (
              <p className="easy-field-hint easy-fade-in" style={{ color: '#f59e0b' }}>
                ⚠️ الارتفاع المحدد يختلف عن المعيار المصري (3.6م) — سيُحسب تكلفة البياض والتشطيب على الارتفاع الفعلي
              </p>
            )}
            {(formData.ceilingHeight === '3.6' || !formData.ceilingHeight) && (
              <p className="easy-field-hint">
                الكود المصري للبناء: الارتفاع المعياري للدور السكني 3.6م (من بلاطة لبلاطة)
              </p>
            )}
          </div>

          {/* Residential: شقة / فيلا */}
          {isResidential && (
            <>
              <div className="easy-form-row">
                <div className="easy-form-group">
                  <label className="easy-form-label">
                    المساحة الإجمالية للوحدة (م²)
                    {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
                  </label>
                  <input type="text" className="easy-form-input"
                    placeholder="مثال: 180"
                    value={formData.unitArea || ''}
                    onChange={e => update('unitArea', e.target.value)} />
                </div>
                <div className="easy-form-group">
                  <label className="easy-form-label">
                    عدد الغرف
                    <OptionalBadge label={t('fieldOptional')} />
                  </label>
                  <select className="easy-form-input"
                    value={formData.roomsCount || ''}
                    onChange={e => update('roomsCount', e.target.value)}>
                    <option value="">اختر</option>
                    {['1','2','3','4','5','6','7+'].map(n => (
                      <option key={n} value={n}>{n} {n === '1' ? 'غرفة' : 'غرف'}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="easy-form-row">
                <div className="easy-form-group">
                  <label className="easy-form-label">
                    عدد الحمامات
                    <OptionalBadge label={t('fieldOptional')} />
                  </label>
                  <select className="easy-form-input"
                    value={formData.bathroomsCount || ''}
                    onChange={e => update('bathroomsCount', e.target.value)}>
                    <option value="">اختر</option>
                    {['1','2','3','4','5+'].map(n => (
                      <option key={n} value={n}>{n} {n === '1' ? 'حمام' : 'حمامات'}</option>
                    ))}
                  </select>
                </div>
                {unitType === 'villa' && (
                  <div className="easy-form-group">
                    <label className="easy-form-label">
                      عدد الأدوار
                      {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
                    </label>
                    <select className="easy-form-input"
                      value={formData.floorsCount || ''}
                      onChange={e => update('floorsCount', e.target.value)}>
                      <option value="">اختر</option>
                      {['1','2','3','4'].map(n => (
                        <option key={n} value={n}>{n} {n === '1' ? 'دور' : 'أدوار'}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Phased finishing note for residential */}
              <div className="easy-finishing-phase-note">
                <span>💡</span>
                <p>
                  الدراسة ستخرج <strong>مقسّمة بنود مستقلة</strong> — كل بند بتكلفته لوحده حتى تتمكن من التشطيب على مراحل
                  (الرخام أولاً / الكهرباء أولاً / الحمامات أولاً / إلخ)
                </p>
              </div>
            </>
          )}

          {/* Clinical */}
          {isClinical && (
            <div className="easy-form-row">
              <div className="easy-form-group">
                <label className="easy-form-label">
                  المساحة الإجمالية (م²)
                  {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
                </label>
                <input type="text" className="easy-form-input"
                  placeholder="مثال: 300"
                  value={formData.unitArea || ''}
                  onChange={e => update('unitArea', e.target.value)} />
              </div>
              {unitType === 'medical' && (
                <div className="easy-form-group">
                  <label className="easy-form-label">
                    عدد الأدوار
                    <OptionalBadge label={t('fieldOptional')} />
                  </label>
                  <select className="easy-form-input"
                    value={formData.floorsCount || ''}
                    onChange={e => update('floorsCount', e.target.value)}>
                    <option value="">اختر</option>
                    {['1','2','3','4','5','6'].map(n => (
                      <option key={n} value={n}>{n} {n === '1' ? 'دور' : 'أدوار'}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="easy-form-group">
                <label className="easy-form-label">
                  عدد الغرف / الوحدات الطبية
                  <OptionalBadge label={t('fieldOptional')} />
                </label>
                <input type="text" className="easy-form-input"
                  placeholder="مثال: 6 عيادات"
                  value={formData.roomsCount || ''}
                  onChange={e => update('roomsCount', e.target.value)} />
              </div>
            </div>
          )}

          {/* Commercial / Admin / Hotel */}
          {isCommercial && (
            <div className="easy-form-row">
              <div className="easy-form-group">
                <label className="easy-form-label">
                  المساحة الإجمالية (م²)
                  {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
                </label>
                <input type="text" className="easy-form-input"
                  placeholder="مثال: 1,200"
                  value={formData.unitArea || ''}
                  onChange={e => update('unitArea', e.target.value)} />
              </div>
              <div className="easy-form-group">
                <label className="easy-form-label">
                  عدد الأدوار
                  <OptionalBadge label={t('fieldOptional')} />
                </label>
                <select className="easy-form-input"
                  value={formData.floorsCount || ''}
                  onChange={e => update('floorsCount', e.target.value)}>
                  <option value="">اختر</option>
                  {['1','2','3','4','5','6','7','8','10+'].map(n => (
                    <option key={n} value={n}>{n} {n === '1' ? 'دور' : 'أدوار'}</option>
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
                    إجمالي المساحة (م²)
                    {hasDocuments ? <OptionalBadge label={t('fieldOptional')} /> : <RequiredBadge label={t('fieldRequired')} />}
                  </label>
                  <input type="text" className="easy-form-input"
                    placeholder="مثال: 2,000"
                    value={formData.unitArea || ''}
                    onChange={e => update('unitArea', e.target.value)} />
                </div>
                <div className="easy-form-group">
                  <label className="easy-form-label">
                    عدد الأدوار
                    <OptionalBadge label={t('fieldOptional')} />
                  </label>
                  <select className="easy-form-input"
                    value={formData.floorsCount || ''}
                    onChange={e => update('floorsCount', e.target.value)}>
                    <option value="">اختر</option>
                    {['2','3','4','5','6','7','8','10+'].map(n => (
                      <option key={n} value={n}>{n} أدوار</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="easy-form-group" style={{ width: '100%' }}>
                <label className="easy-form-label">
                  توزيع الأدوار (نوع كل دور)
                  <OptionalBadge label={t('fieldOptional')} />
                </label>
                <input type="text" className="easy-form-input"
                  placeholder="مثال: الأرضي تجاري — الأول إداري — 2 إلى 5 سكني"
                  value={formData.mixedFloorDesc || ''}
                  onChange={e => update('mixedFloorDesc', e.target.value)} />
              </div>
            </div>
          )}

          {/* Location + Notes */}
          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">
                الموقع
                <OptionalBadge label={t('fieldOptional')} />
              </label>
              <LocationPicker
                value={formData.location || ''}
                onChange={v => update('location', v)}
                lat={formData.locationLat}
                lng={formData.locationLng}
                onLatLngChange={(lat, lng) => onChange({ ...formData, locationLat: lat, locationLng: lng })}
              />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">
                ملاحظات إضافية
                <OptionalBadge label={t('fieldOptional')} />
              </label>
              <input type="text" className="easy-form-input"
                placeholder="أي تفاصيل خاصة بالتشطيب المطلوب"
                value={formData.description || ''}
                onChange={e => update('description', e.target.value)} />
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
