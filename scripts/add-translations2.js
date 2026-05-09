const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '../i18n/messages/en.json');
const arPath = path.join(__dirname, '../i18n/messages/ar.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const newEn = {
  // Manual entry card items
  manualItemName:     "Project Name",
  manualItemLocation: "Geographic Location",
  manualItemArea:     "Area & Dimensions",
  manualItemDetails:  "Project Details",
  // Valuation agriLand ratios
  valuationAgriRatiosTitle: "Allowed Building Ratios from Total Land Area",
  valuationAgriIndustrial:  "Industrial",
  valuationAgriResidential: "Residential",
  valuationAgriTourism:     "Tourism / Entertainment",
  // Valuation road type
  valuationRoadType:    "Available Road Type",
  valuationRoadMain:    "Main Road",
  valuationRoadSide:    "Side Road",
  valuationRoadUnpaved: "Unpaved Track",
  // Valuation finish level options
  valuationFinishNone:    "No Finishing",
  valuationFinishNormal:  "Normal Finishing",
  valuationFinishMedium:  "Medium Finishing",
  valuationFinishPremium: "Premium Finishing",
  valuationFinishLuxury:  "Hotel / Luxury Finishing",
  // Valuation notes placeholder
  valuationNotesPlaceholder: "Any additional details that help improve valuation accuracy (nearby projects, services, legal issues, etc.)",
  // Valuation hint messages
  valuationHintLocation:  "Please select a location first.",
  valuationHintArea:      "Please enter the property area.",
  valuationHintCondition: "Please select the property condition.",
  // Optional label
  optionalLabel: "(optional)",
};

const newAr = {
  // Manual entry card items
  manualItemName:     "اسم المشروع",
  manualItemLocation: "الموقع الجغرافي",
  manualItemArea:     "المساحة والأبعاد",
  manualItemDetails:  "تفاصيل المشروع",
  // Valuation agriLand ratios
  valuationAgriRatiosTitle: "نسب المباني المسموح بها من إجمالي مساحة الأرض",
  valuationAgriIndustrial:  "صناعي",
  valuationAgriResidential: "سكني",
  valuationAgriTourism:     "سياحي / ترفيهي",
  // Valuation road type
  valuationRoadType:    "نوع الطريق المتاح",
  valuationRoadMain:    "طريق رئيسي",
  valuationRoadSide:    "طريق فرعي",
  valuationRoadUnpaved: "مدق (غير مسفلت)",
  // Valuation finish level options
  valuationFinishNone:    "بدون تشطيب",
  valuationFinishNormal:  "تشطيب عادي",
  valuationFinishMedium:  "تشطيب متوسط",
  valuationFinishPremium: "تشطيب راقي",
  valuationFinishLuxury:  "تشطيب فندقي",
  // Valuation notes placeholder
  valuationNotesPlaceholder: "أي تفاصيل إضافية تساعد في دقة التقييم (مجاورة لمشاريع، قرب من خدمات، مشاكل قانونية، إلخ)",
  // Valuation hint messages
  valuationHintLocation:  "برجاء اختيار الموقع أولاً.",
  valuationHintArea:      "برجاء إدخال مساحة العقار.",
  valuationHintCondition: "برجاء اختيار حالة العقار.",
  // Optional label
  optionalLabel: "(اختياري)",
};

Object.assign(en.easyStart, newEn);
Object.assign(ar.easyStart, newAr);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2), 'utf8');

console.log('Done! Added', Object.keys(newEn).length, 'keys to each file.');
