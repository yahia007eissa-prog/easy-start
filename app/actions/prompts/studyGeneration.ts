interface FormData {
  projectName: string;
  projectType?: string;
  studyType: "realEstate" | "medical" | "agricultural" | "industrial";
  method: "fast" | "full";
  location: string;
  [key: string]: string | undefined;
}

const STUDY_TYPE_LABELS: Record<
  FormData["studyType"],
  { ar: string; en: string }
> = {
  realEstate: { ar: "عقاري", en: "Real Estate" },
  medical: { ar: "طبي وصحي", en: "Medical & Health" },
  agricultural: { ar: "زراعي", en: "Agricultural" },
  industrial: { ar: "صناعي", en: "Industrial" },
};

// Fields to exclude from dynamic output (already handled separately)
const EXCLUDED_FIELDS = new Set([
  'projectName',
  'projectType',
  'studyType',
  'method',
  'location',
]);

// Fields that should be human-readable labels (not raw keys)
const FIELD_LABELS: Record<string, { ar: string; en: string }> = {
  // Soil types
  sandy: { ar: "رملية", en: "Sandy" },
  clay: { ar: "طينية", en: "Clay" },
  loam: { ar: "طمية", en: "Loam" },
  silt: { ar: "غرينية", en: "Silt" },
  peat: { ar: "خثية", en: "Peat" },
  // Water sources
  well: { ar: "بئر", en: "Well" },
  river: { ar: "نهر", en: "River" },
  irrigation: { ar: "ترعة ري", en: "Irrigation Canal" },
  desalination: { ar: "تحليه", en: "Desalination" },
  rainwater: { ar: "تجميع مياه الأمطار", en: "Rainwater Harvesting" },
  // Reclamation status
  new: { ar: "أرض جديدة", en: "New Land" },
  partial: { ar: "مستصلحة جزئياً", en: "Partially Reclaimed" },
  full: { ar: "مستصلحة بالكامل", en: "Fully Reclaimed" },
  // Post-harvest goals
  local: { ar: "سوق محلي", en: "Local Market" },
  export: { ar: "تصدير", en: "Export" },
  processing: { ar: "معالجة صناعية", en: "Industrial Processing" },
  seeds: { ar: "إنتاج بذور", en: "Seed Production" },
  // Finishing levels
  none:   { ar: "بدون تشطيب", en: "No Finishing" },
  normal: { ar: "عادي", en: "Normal" },
  medium: { ar: "متوسط", en: "Medium" },
  premium: { ar: "راقي", en: "Premium" },
  luxury: { ar: "فندقي فاخر", en: "Luxury Hotel" },
  // Basement
  one: { ar: "بدروم واحد", en: "One basement" },
  two: { ar: "بدرومين", en: "Two basements" },
  more: { ar: "أكثر من بدرومين", en: "More than two" },
  // Basement (alternative)
  noBasement: { ar: "لا يوجد", en: "None" },
};

// Convert field key to human-readable label
function fieldKeyToLabel(key: string): string {
  // Check if there's a direct translation
  if (FIELD_LABELS[key]) {
    return FIELD_LABELS[key].en;
  }

  // Convert camelCase/snake_case to Title Case with spaces
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

// Format field value - check if there's a translation for this value
function formatFieldValue(key: string, value: string | undefined): string {
  if (!value) return "غير محدد"; // "Not specified"

  if (FIELD_LABELS[value]) {
    return FIELD_LABELS[value].en;
  }

  return value;
}

export function studyGenerationPrompt(
  data: FormData,
  pricingData: string = "",
): string {
  const isFast = data.method === "fast";
  const studyType = STUDY_TYPE_LABELS[data.studyType];

  // Dynamically collect all form fields
  const formFields: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (EXCLUDED_FIELDS.has(key)) continue;
    if (!value || value.trim() === '') continue;

    const label = fieldKeyToLabel(key);
    const formattedValue = formatFieldValue(key, value);
    formFields.push(`- ${label}: ${formattedValue}`);
  }

  const formFieldsSection = formFields.length > 0
    ? `\n${formFields.join('\n')}`
    : '';

  return `أنت خبير متخصص في دراسات الجدوى في مصر، لديك خبرة واسعة بأسعار السوق المصري الحالية.

=== بيانات المشروع ===
- اسم المشروع: ${data.projectName}
- القطاع: ${studyType.ar}
- الموقع: ${data.location}
- دقة الدراسة: ${isFast ? "تقريبية (80%+)" : "تفصيلية كاملة (BOQ)"}
${formFieldsSection}

${pricingData}

=== المطلوب ===
أعد دراسة جدوى شاملة باللغة العربية تشمل:

1. ملخص تنفيذي
2. تحليل الموقع والبنية التحتية
3. ${isFast ? "تقدير التكلفة التقريبية (نطاق الحد الأدنى — الحد الأقصى)" : "تفصيل BOQ بند بند"}
4. ${isFast ? "جدول زمني أولي" : "جدول زمني تفصيلي بالمراحل"}
5. ${isFast ? "تحليل مالي أولي (ROI، فترة الاسترداد)" : "تحليل مالي شامل (ROI، التدفقات النقدية، فترة الاسترداد، نقطة التعادل)"}
6. تقييم المخاطر والتوصيات

=== قواعد الإخراج ===
- اكتب بالعربية الفصحى البسيطة
- استخدم ## للعناوين الرئيسية و### للعناوين الفرعية
- استخدم جداول للأرقام والتفاصيل
- العملة: الجنيه المصري (ج.م)
- قدم نطاقاً للتكلفة (الحد الأدنى — الحد الأقصى)
- أضف هامش احتياطي 10% على التكاليف
- استند على أسعار السوق المصري الحالية من خبرتك
- وضح بوضوح أن هذه دراسة تقديرية تستند على بيانات السوق وليست أسعاراً نهائية`;
}
