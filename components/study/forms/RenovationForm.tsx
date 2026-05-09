'use client';

import { useTranslations } from 'next-intl';
import { ImageUploadZone } from './renovation/ImageUploadZone';

interface RenovationFormProps {
  formData: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const RequiredBadge = ({ label }: { label: string }) => (
  <span className="easy-field-badge easy-field-required">{label}</span>
);

export function RenovationForm({ formData, onChange }: RenovationFormProps) {
  const t = useTranslations('easyStart');

  const update = (field: string, value: string) =>
    onChange({ ...formData, [field]: value });

  const images: string[] = formData.renovationImages
    ? JSON.parse(formData.renovationImages)
    : [];

  const handleImagesChange = (imgs: string[]) =>
    update('renovationImages', JSON.stringify(imgs));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Description */}
      <div className="easy-form-group" style={{ width: '100%' }}>
        <label className="easy-form-label">
          وصف حالة المبنى والأعمال المطلوبة
          <RequiredBadge label={t('fieldRequired')} />
        </label>
        <textarea
          className="easy-form-input easy-renovation-desc"
          placeholder={`اكتب وصفاً تفصيلياً — مثال:\n• سقف الدور الثاني مشروخ وفيه تسريب مياه\n• حديد ظاهر من الخرسانة في الأعمدة الأمامية\n• الواجهة تحتاج إعادة لياسة وطلاء\n• عدد الغرف المطلوب ترميمها: 4 غرف`}
          rows={6}
          value={formData.renovationDescription || ''}
          onChange={e => update('renovationDescription', e.target.value)}
        />
        <p className="easy-field-hint">
          كلما كان الوصف أكثر تفصيلاً — كانت الدراسة أدق. اذكر: المشاكل الموجودة، الأماكن المتضررة، طبيعة الضرر.
        </p>
      </div>

      {/* Image upload */}
      <div className="easy-form-group" style={{ width: '100%' }}>
        <label className="easy-form-label">
          صور المبنى والأماكن المتضررة
          <RequiredBadge label={t('fieldRequired')} />
        </label>
        <ImageUploadZone images={images} onImagesChange={handleImagesChange} />
        <p className="easy-field-hint">
          ارفع صور واضحة للأماكن المتضررة — الصور تساعد في تقدير حجم العمل وتُضمَّن في الدراسة.
        </p>
      </div>

    </div>
  );
}
