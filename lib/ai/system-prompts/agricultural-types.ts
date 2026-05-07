// Agricultural User Inputs Prompt
// Template for collecting and formatting user input from form

// Labels for agricultural project types
export const AGRICULTURAL_LABELS = {
  cropTypes: {
    field_crops: 'محاصيل حقلية (قمح، ذرة، بطاطس)',
    vegetables: 'خضروات (طماطم، فلفل، خيار)',
    fruits: 'أشجار فاكهة (برتقال، مانجو، زيتون)',
    industrial: 'محاصيل صناعية (قصب، بنجر)',
  },
  irrigationTypes: {
    drip: 'نقطة بالتنقيط',
    sprinkler: 'رش محوري',
    flood: 'غمر تقليدي',
    center_pivot: 'CENTER PIVOT',
  },
  waterSources: {
    nile: 'نهر النيل',
    groundwater: 'مياه جوفية (آبار)',
    irrigation_canal: 'ترعة / canal',
    mixed: 'مختلط',
  },
  soilTypes: {
    clay: 'طينية',
    sandy: 'رملية',
    loam: 'طمية',
    mixed: 'مختلطة',
  },
};

// All field values that need translation
const FIELD_VALUE_LABELS: Record<string, string> = {
  // Water sources
  well: 'بئر',
  nile: 'نهر النيل',
  river: 'نهر',
  groundwater: 'مياه جوفية',
  irrigation: 'ترعة ري',
  irrigation_canal: 'ترعة',
  desalination: 'تحليه',
  rainwater: 'مياه أمطار',
  // Reclamation status
  new: 'أرض جديدة',
  partial: 'مستصلحة جزئياً',
  full: 'مستصلحة بالكامل',
  // Post-harvest
  local: 'سوق محلي',
  export: 'تصدير',
  processing: 'معالجة صناعية',
  seeds: 'إنتاج بذور',
  // Soil types
  clay: 'طينية',
  sandy: 'رملية',
  loam: 'طمية',
  silt: 'غرينية',
  peat: 'خثية',
  // Irrigation types
  drip: 'تنقيط',
  sprinkler: 'رش',
  flood: 'غمر',
  centerPivot: 'محوري',
  // Crop types
  farm: 'مزرعة',
  orchard: 'بستان',
  greenhouse: 'صوبة',
  // Basement
  none: 'لا يوجد',
  noBasement: 'لا يوجد',
  one: 'بدروم واحد',
  two: 'بدرومين',
  more: 'أكثر من بدرومين',
};

// Convert field key to human-readable label (Arabic)
function fieldKeyToLabel(key: string): string {
  const keyLabels: Record<string, string> = {
    projectName: 'اسم المشروع',
    location: 'الموقع',
    description: 'الوصف',
    studyType: 'نوع الدراسة',
    method: 'طريقة الدراسة',
    area: 'المساحة (فدان)',
    landArea: 'المساحة',
    soil_type: 'نوع التربة',
    ph: 'درجة حموضة التربة (pH)',
    ec: 'ملوحة التربة EC',
    reclaim_status: 'حالة الاستصلاح',
    water_source: 'مصدر المياه',
    well_depth: 'عمق البئر (متر)',
    well_flow: 'تصرف البئر',
    water_tds: 'ملوحة المياه TDS',
    crop: 'نوع المحصول',
    postharvest_goal: 'هدف ما بعد الحصاد',
    buildings_list: 'قائمة المباني',
    projectType: 'نوع المحصول',
    finishingLevel: 'مستوى التشطيب',
    basement: 'البدروم',
    floorsCount: 'عدد الأدوار',
    constructionArea: 'مساحة البناء',
    powerCapacity: 'قدرة الكهرباء',
    employeeCount: 'عدد العمال',
    industryType: 'نوع الصناعة',
    bedCount: 'عدد الأسرّة',
    targetCrop: 'المحصول المستهدف',
    irrigationType: 'نوع الري',
    soilType: 'نوع التربة',
    waterSource: 'مصدر المياه',
  };

  return keyLabels[key] || key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

// Get Arabic label for field value
function getFieldValueLabel(value: string): string {
  return FIELD_VALUE_LABELS[value] || value;
}

// Dynamic form data interface
interface DynamicFormData {
  projectName?: string;
  studyType?: string;
  method?: string;
  location?: string;
  [key: string]: string | undefined;
}

export function agriculturalUserInputs(data: DynamicFormData): string {
  const method = data.method === 'fast' ? 'تقريبي (دقة 80%+)' : 'تفصيلي (BOQ)';

  // Collect all non-empty fields dynamically
  const fields: string[] = [];

  // Core fields
  if (data.projectName) {
    fields.push(`- اسم المشروع: ${data.projectName}`);
  }
  if (data.location) {
    fields.push(`- الموقع: ${data.location}`);
  }
  if (data.studyType) {
    fields.push(`- نوع الدراسة: ${data.studyType === 'agricultural' ? 'زراعي' : data.studyType}`);
  }
  fields.push(`- مستوى الدراسة: ${method}`);

  // All other fields from form
  for (const [key, value] of Object.entries(data)) {
    if (!value || value.trim() === '') continue;

    // Skip core fields already handled
    if (['projectName', 'studyType', 'method', 'location'].includes(key)) continue;

    const label = fieldKeyToLabel(key);
    const formattedValue = getFieldValueLabel(value);
    fields.push(`- ${label}: ${formattedValue}`);
  }

  // If no additional fields, add a note
  const additionalFields = fields.filter(f => !f.includes('اسم المشروع') && !f.includes('الموقع') && !f.includes('مستوى الدراسة')).length > 0
    ? fields.filter(f => !f.includes('اسم المشروع') && !f.includes('الموقع') && !f.includes('مستوى الدراسة'))
    : ['- لا توجد بيانات إضافية متوفرة'];

  return `
=== معلومات المشروع ===
${fields.slice(0, 4).join('\n')}

=== بيانات المشروع ===
${additionalFields.join('\n')}
`;
}