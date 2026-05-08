export interface ValuationFormData {
  propType: string;
  location: string;
  area: string;
  areaUnit: string;
  condition: string;
  utilities?: string[];
  floor?: string;
  buildingAge?: string;
  finishLevel?: string;
  notes?: string;
}

const PROP_TYPE_LABELS: Record<string, string> = {
  agriLand:    'أرض زراعية',
  urbanLand:   'أرض مياني / للبناء',
  apartment:   'شقة سكنية',
  commercial:  'محل / مسطح تجاري',
  fullEstate:  'عقار متكامل (أرض + مبنى)',
};

const CONDITION_LABELS: Record<string, string> = {
  excellent:    'ممتاز',
  good:         'جيد',
  average:      'متوسط',
  needsMaint:   'يحتاج صيانة',
};

export function buildValuationPrompt(data: ValuationFormData): string {
  const propLabel   = PROP_TYPE_LABELS[data.propType]  ?? data.propType;
  const condLabel   = CONDITION_LABELS[data.condition] ?? data.condition;
  const areaDisplay = `${data.area} ${data.areaUnit === 'feddan' ? 'فدان' : 'م²'}`;
  const utilitiesLine = data.utilities?.length
    ? `المرافق المتاحة: ${data.utilities.join(' — ')}`
    : '';
  const apartmentLine = data.propType === 'apartment'
    ? `\n- الطابق: ${data.floor ?? 'غير محدد'}\n- عمر المبنى: ${data.buildingAge ?? 'غير محدد'} سنة\n- مستوى التشطيب: ${data.finishLevel ?? 'غير محدد'}`
    : '';

  return `
أنت خبير تقييم عقاري معتمد ومتخصص في السوق العقاري المصري.
مهمتك: إعداد تقرير تقييم احترافي ومفصّل للعقار التالي بناءً على بيانات العميل وأسعار السوق الحالية.

═══════════════════════════════════════
بيانات العقار المراد تقييمه:
═══════════════════════════════════════
- نوع العقار: ${propLabel}
- الموقع / المنطقة: ${data.location}
- المساحة: ${areaDisplay}
- الحالة العامة: ${condLabel}
${utilitiesLine}${apartmentLine}
${data.notes ? `- ملاحظات العميل: ${data.notes}` : ''}

═══════════════════════════════════════
مؤشرات السوق الحالية (مصدر: اليوم — ${new Date().toLocaleDateString('ar-EG')}):
═══════════════════════════════════════
- حديد عز: 38,993 جنيه / طن
- أسمنت: 3,896 جنيه / طن
- دولار أمريكي: 53.72 جنيه
- ذهب عيار 21: 6,970 جنيه / جرام

═══════════════════════════════════════
المطلوب: تقرير تقييم احترافي يشمل:
═══════════════════════════════════════

## 1. ملخص تنفيذي
- القيمة التقديرية الإجمالية
- سعر المتر التقديري
- مستوى الثقة في التقييم (عالي / متوسط / يحتاج معاينة)

## 2. تحليل الموقع والعقار
- تقييم الموقع الجغرافي وأثره على القيمة
- وصف حالة العقار وتأثيرها
- نقاط القوة والضعف

## 3. منهجية التقييم
- المنهجية المستخدمة (مقارنة السوق / التكلفة / الدخل)
- مبررات الوصول للسعر

## 4. السعر التقديري
- سعر المتر المربع التقديري: X جنيه / م²
- إجمالي قيمة العقار: X جنيه
- نطاق السعر: من X إلى X جنيه

## 5. العوامل المؤثرة على القيمة
### عوامل ترفع القيمة:
- نقطة 1
- نقطة 2
### عوامل تخفض القيمة:
- نقطة 1
- نقطة 2

## 6. توصية نهائية
- رأيك كخبير تقييم في العقار
- هل السعر مناسب للشراء؟ للبيع؟ للاستثمار؟
- توصيات للزيادة في القيمة (إن وجدت)

اكتب التقرير باللغة العربية بأسلوب احترافي مناسب للتقديم للبنوك وجهات التمويل.
`.trim();
}
