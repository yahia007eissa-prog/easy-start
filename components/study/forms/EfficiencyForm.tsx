'use client';

import { useTranslations } from 'next-intl';
import { ImageUploadZone } from './renovation/ImageUploadZone';
import { LocationPicker } from './LocationPicker';

interface EfficiencyFormProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const ACTIVITY_OPTIONS = [
  { value: 'bank',        label: '🏦 بنك / فرع بنكي' },
  { value: 'hypermarket', label: '🛒 هايبر ماركت / سوبر ماركت' },
  { value: 'fashion',     label: '👗 محل ملابس / فاشون' },
  { value: 'pharmacy',    label: '💊 صيدلية / سلسلة صيدليات' },
  { value: 'restaurant',  label: '🍽️ مطعم / سلسلة مطاعم' },
  { value: 'cafe',        label: '☕ كافيه / سلسلة كافيهات' },
  { value: 'clinic',      label: '🏥 عيادة / مركز طبي' },
  { value: 'gym',         label: '💪 جيم / نادي رياضي' },
  { value: 'office',      label: '🏢 مكاتب إدارية' },
  { value: 'showroom',    label: '🚗 معرض سيارات / شوروم' },
  { value: 'hotel',       label: '🏨 فندق / شقق فندقية' },
  { value: 'other',       label: '📋 نشاط آخر' },
];

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
            نوع النشاط التجاري
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.activityType || ''}
            onChange={e => update('activityType', e.target.value)}
          >
            <option value="">اختر نوع النشاط</option>
            {ACTIVITY_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Custom activity name if "other" */}
        {formData.activityType === 'other' && (
          <div className="easy-form-group easy-fade-in">
            <label className="easy-form-label">
              اسم النشاط
              <RequiredBadge label={t('fieldRequired')} />
            </label>
            <input
              type="text"
              className="easy-form-input"
              placeholder="مثال: محل إلكترونيات"
              value={formData.activityCustomName || ''}
              onChange={e => update('activityCustomName', e.target.value)}
            />
          </div>
        )}

        {formData.activityType !== 'other' && (
          <div className="easy-form-group">
            <label className="easy-form-label">
              اسم البراند / الشركة
              <OptionalBadge label={t('fieldOptional')} />
            </label>
            <input
              type="text"
              className="easy-form-input"
              placeholder="مثال: Banque Misr — Zara — Carrefour"
              value={formData.brandName || ''}
              onChange={e => update('brandName', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Location + Area + Floors */}
      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            الموقع
            <RequiredBadge label={t('fieldRequired')} />
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
            المساحة الإجمالية (م²)
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <input
            type="text"
            className="easy-form-input"
            placeholder="مثال: 1,200"
            value={formData.totalArea || ''}
            onChange={e => update('totalArea', e.target.value)}
          />
        </div>
      </div>

      <div className="easy-form-row">
        <div className="easy-form-group">
          <label className="easy-form-label">
            عدد الأدوار
            <RequiredBadge label={t('fieldRequired')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.floorsCount || '1'}
            onChange={e => update('floorsCount', e.target.value)}
          >
            {['1','2','3','4','5','6'].map(n => (
              <option key={n} value={n}>{n} {n === '1' ? 'دور' : 'أدوار'}</option>
            ))}
            <option value="more">أكثر من 6</option>
          </select>
        </div>
        <div className="easy-form-group">
          <label className="easy-form-label">
            مستوى التشطيب المستهدف
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <select
            className="easy-form-input"
            value={formData.targetFinishing || ''}
            onChange={e => update('targetFinishing', e.target.value)}
          >
            <option value="">غير محدد</option>
            <option value="normal">عادي</option>
            <option value="medium">متوسط</option>
            <option value="premium">راقي</option>
            <option value="luxury">فندقي فاخر</option>
          </select>
        </div>
      </div>

      {/* Current state description */}
      <div className="easy-form-group" style={{ width: '100%' }}>
        <label className="easy-form-label">
          وصف الحالة الراهنة للمكان
          <OptionalBadge label={t('fieldOptional')} />
        </label>
        <textarea
          className="easy-form-input easy-renovation-desc"
          placeholder="مثال: المكان حالياً خام بالكامل — أو: يحتاج إزالة تشطيب قديم وإعادة تصميم — أو: يعمل حالياً ويحتاج تطوير بدون إيقاف النشاط"
          rows={3}
          value={formData.currentStateDesc || ''}
          onChange={e => update('currentStateDesc', e.target.value)}
        />
      </div>

      {/* Current state photos */}
      <div className="easy-form-group" style={{ width: '100%' }}>
        <label className="easy-form-label">
          صور الواقع الحالي
          <RequiredBadge label={t('fieldRequired')} />
        </label>
        <ImageUploadZone
          images={currentImages}
          onImagesChange={imgs => update('currentStateImages', JSON.stringify(imgs))}
        />
        <p className="easy-field-hint">صور واضحة للمكان كما هو الآن — الأرضيات، الأسقف، الجدران، التمديدات</p>
      </div>

      {/* Target: photos OR description */}
      <div className="easy-efficiency-target-wrap">
        <p className="easy-efficiency-target-title">المطلوب تنفيذه — صور مرجعية أو وصف</p>
        <p className="easy-efficiency-target-hint">ارفع صور مرجعية للتصميم المطلوب (brand guidelines / مثال مشابه) أو اكتب وصفاً للمطلوب</p>

        <ImageUploadZone
          images={targetImages}
          onImagesChange={imgs => update('targetStateImages', JSON.stringify(imgs))}
        />

        <div className="easy-form-group" style={{ width: '100%', marginTop: '12px' }}>
          <label className="easy-form-label">
            أو: وصف المطلوب تنفيذه
            <OptionalBadge label={t('fieldOptional')} />
          </label>
          <textarea
            className="easy-form-input easy-renovation-desc"
            placeholder="مثال: تطبيق هوية البراند الجديدة — استبدال الإضاءة بـ LED — تركيب أرضيات بورسلان 80×80 — تنفيذ كاونتر استقبال زجاجي"
            rows={4}
            value={formData.targetStateDesc || ''}
            onChange={e => update('targetStateDesc', e.target.value)}
          />
        </div>
      </div>

    </div>
  );
}
