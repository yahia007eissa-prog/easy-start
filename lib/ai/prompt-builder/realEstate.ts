import type { PromptBuilder, StudyFormData } from './types';

// ── helpers ──────────────────────────────────────────────────────────────────

const OWNERSHIP_LABEL: Record<string, string> = {
  full:        'ملكية ثابتة',
  partnership: 'مشاركة',
  usufruct:    'حق انتفاع',
};

const FINISHING_LABEL: Record<string, string> = {
  none:    'بدون تشطيب',
  normal:  'عادي',
  medium:  'متوسط',
  premium: 'راقي',
  luxury:  'فندقي فاخر',
};

const BASEMENT_LABEL: Record<string, string> = {
  none: 'لا يوجد بدروم',
  one:  'بدروم واحد',
  two:  'بدرومين',
  more: 'أكثر من بدرومين',
};

const SUBTYPE_LABEL: Record<string, string> = {
  integrated:  'تطوير عمراني متكامل',
  residential: 'منزل سكني',
  renovation:  'ترميم',
  efficiency:  'رفع كفاءة',
  finishing:   'تشطيب',
};

function val(v: string | undefined, fallback = 'غير محدد') {
  return v && v.trim() ? v.trim() : fallback;
}

function labeled(label: string, v: string | undefined) {
  if (!v || !v.trim()) return '';
  return `- ${label}: ${v.trim()}`;
}

// ── Integrated Urban Development prompt ──────────────────────────────────────

function buildIntegratedPrompt(d: StudyFormData): string {
  const method = d.method === 'fast' ? 'تقريبية (80%+)' : 'تفصيلية كاملة (BOQ)';

  // ── Land section ──
  const ownership = OWNERSHIP_LABEL[d.ownershipType || 'full'] ?? d.ownershipType ?? 'ملكية ثابتة';
  const usufruct = d.ownershipType === 'usufruct' && d.usufructDuration
    ? `\n- مدة حق الانتفاع: ${d.usufructDuration}` : '';

  const landSection = `
=== بيانات الأرض ===
- موقع الأرض: ${val(d.landLocation ?? d.location)}
- المساحة الإجمالية للأرض: ${val(d.totalLandArea)} م²
${labeled('سعر المتر', d.landPrice)}
- نوع الملكية: ${ownership}${usufruct}`.trim();

  // ── Components ──
  const components: string[] = [];

  if (d.hasResidential === 'true') {
    const resType = d.residentialType || 'villas';
    const resLabel = resType === 'mixed' ? 'مشترك (فيلات + عمارات)'
      : resType === 'villas' ? 'فيلات' : 'عمارات';
    const status = d.residentialBuildingStatus === 'shared' ? 'في مبنى مشترك' : 'مبنى منفصل';

    let resDetails = `🏠 القطاع السكني — ${resLabel} | ${status}`;

    if (resType === 'villas' || resType === 'mixed') {
      resDetails += `
  فيلات:
  - العدد: ${val(d.villaCount)} فيلا
  - مساحة الفيلا: ${val(d.villaArea)} م²
  - عدد الأدوار: ${val(d.villaFloors)}
  ${d.villaRequirements ? `- اشتراطات: ${d.villaRequirements}` : ''}`.trimEnd();
    }

    if (resType === 'apartments' || resType === 'mixed') {
      resDetails += `
  عمارات:
  - عدد العمارات: ${val(d.apartmentBuildingCount)}
  - مساحة أرض العمارة: ${val(d.apartmentBuildingArea)} م²
  - عدد الأدوار: ${val(d.apartmentFloors)}
  ${d.unitsPerFloor ? `- وحدات في الدور: ${d.unitsPerFloor}` : ''}
  ${d.apartmentRequirements ? `- اشتراطات: ${d.apartmentRequirements}` : ''}`.trimEnd();
    }

    components.push(resDetails);
  }

  if (d.hasCommercial === 'true') {
    const comType = d.commercialType === 'shops' ? 'محلات منفردة' : 'مول';
    const status = d.commercialBuildingStatus === 'shared' ? 'في مبنى مشترك' : 'مبنى منفصل';
    components.push(`🏬 القطاع التجاري — ${comType} | ${status}
  - المساحة: ${val(d.commercialArea)} م²
  - الأدوار: ${val(d.commercialFloors)}
  ${d.commercialRequirements ? `- اشتراطات: ${d.commercialRequirements}` : ''}`.trimEnd());
  }

  if (d.hasAdministrative === 'true') {
    const status = d.adminBuildingStatus === 'shared' ? 'في مبنى مشترك' : 'مبنى منفصل';
    components.push(`🏢 القطاع الإداري | ${status}
  - عدد المباني: ${val(d.adminBuildingCount)}
  - المساحة: ${val(d.adminArea)} م²
  - الأدوار: ${val(d.adminFloors)}
  ${d.adminRequirements ? `- اشتراطات: ${d.adminRequirements}` : ''}`.trimEnd());
  }

  if (d.hasMedical === 'true') {
    const medTypes: Record<string, string> = {
      clinics:    'عيادات',
      hospital:   'مستشفى',
      dispensary: 'مستوصف طوارئ',
      mixed:      'مشترك (عيادات + مستشفى)',
    };
    const medType = medTypes[d.medicalType || 'clinics'] ?? d.medicalType ?? 'عيادات';
    const status = d.medicalBuildingStatus === 'shared' ? 'في مبنى مشترك' : 'مبنى منفصل';
    components.push(`🏥 القطاع الطبي — ${medType} | ${status}
  - المساحة: ${val(d.medicalArea)} م²
  - الأدوار: ${val(d.medicalFloors)}
  ${d.bedsCount ? `- عدد الأسرّة: ${d.bedsCount}` : ''}
  ${d.medicalRequirements ? `- اشتراطات: ${d.medicalRequirements}` : ''}`.trimEnd());
  }

  if (d.hasHotel === 'true') {
    const hotelTypes: Record<string, string> = {
      '3':     'فندق 3 نجوم',
      '4':     'فندق 4 نجوم',
      '5':     'فندق 5 نجوم',
      apart:   'شقق فندقية',
      resort:  'منتجع',
    };
    const hotelType = hotelTypes[d.hotelType || '4'] ?? 'فندق 4 نجوم';
    const status = d.hotelBuildingStatus === 'shared' ? 'في مبنى مشترك' : 'مبنى منفصل';
    components.push(`🏨 القطاع الفندقي — ${hotelType} | ${status}
  - عدد الغرف: ${val(d.hotelRooms)}
  - المساحة: ${val(d.hotelArea)} م²
  - الأدوار: ${val(d.hotelFloors)}
  ${d.hotelFacilities ? `- المرافق: ${d.hotelFacilities}` : ''}
  ${d.hotelRequirements ? `- اشتراطات: ${d.hotelRequirements}` : ''}`.trimEnd());
  }

  if (d.hasEntertainment === 'true') {
    const entType = d.entertainmentType === 'inMall' ? 'نادي داخل المول' : 'نادي اجتماعي منفصل';
    components.push(`🎭 القطاع الترفيهي — ${entType}
  - مساحة النادي: ${val(d.clubArea)} م²
  ${d.clubFacilities ? `- المرافق: ${d.clubFacilities}` : ''}
  ${d.entertainmentRequirements ? `- اشتراطات: ${d.entertainmentRequirements}` : ''}`.trimEnd());
  }

  const componentsSection = components.length
    ? `=== مكونات المشروع ===\n${components.join('\n\n')}`
    : '=== مكونات المشروع ===\nلم يتم تحديد مكونات بعد';

  // ── Sales plan section ──
  const PHASE_NAMES = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة'];
  const COMPONENT_LABELS: Record<string, string> = {
    residential: 'سكني', commercial: 'تجاري', administrative: 'إداري',
    medical: 'طبي', hotel: 'فندقي', entertainment: 'ترفيهي',
  };

  let salesSection = '';
  if (d.salePhases && parseInt(d.salePhases) > 0) {
    const phaseCount = parseInt(d.salePhases);
    const phaseLines: string[] = [];
    for (let i = 1; i <= phaseCount; i++) {
      const raw = d[`salePhase${i}Components`] || '';
      const comps = raw.split(',').filter(Boolean).map(c => COMPONENT_LABELS[c] || c).join(' + ');
      const price = d[`salePhase${i}SalePrice`] ? `\n   - سعر البيع: ${d[`salePhase${i}SalePrice`]} ج.م/م²` : '';
      phaseLines.push(`  المرحلة ${PHASE_NAMES[i - 1]}: ${comps || 'غير محدد'}${price}`);
    }
    salesSection = `
=== خطة البيع على مراحل ===
- إجمالي مدة البيع: ${val(d.saleDuration)}
- عدد مراحل البيع: ${phaseCount} مرحلة
${phaseLines.join('\n')}`;
  }

  const detailLevel = d.method === 'fast'
    ? `3. تقدير التكلفة التقريبية (80%+) — مجموع لكل مكون مع نطاق (الحد الأدنى — الحد الأقصى) بالجنيه المصري
4. جدول زمني أولي للتنفيذ
5. تحليل مالي أولي (ROI، فترة الاسترداد، نقطة التعادل)${salesSection ? '\n6. تحليل التدفقات المالية من البيع على المراحل المحددة' : ''}`
    : `3. تفصيل BOQ لكل مكون على حدة (تأسيس — هيكل — تشطيب — ميكانيكا وكهرباء)
4. جدول زمني تفصيلي بالمراحل
5. تحليل مالي شامل (ROI، التدفقات النقدية، فترة الاسترداد، نقطة التعادل، NPV)${salesSection ? '\n6. جدول التدفقات المالية المتوقعة من البيع — مرحلة بمرحلة (إيرادات، تكاليف، صافي ربح)' : ''}`;

  return `أنت خبير متخصص في دراسات الجدوى العقارية والإنشائية في مصر، لديك خبرة واسعة بأسعار السوق المصري الحالية.

=== بيانات المشروع ===
- اسم المشروع: ${val(d.projectName)}
- نوع المشروع: تطوير عمراني متكامل
- دقة الدراسة: ${method}
${d.description ? `- وصف المشروع: ${d.description}` : ''}

${landSection}

${componentsSection}
${salesSection}

=== المطلوب ===
أعد دراسة جدوى شاملة باللغة العربية تشمل:

1. ملخص تنفيذي (3-5 أسطر)
2. تحليل الموقع والبنية التحتية
${detailLevel}
${salesSection ? '7' : '6'}. تقييم المخاطر والتوصيات

=== قواعد الإخراج — HTML كامل (ألوان: نيلي + ذهبي + فضي) ===
أخرج الدراسة كاملةً بصيغة HTML صالحة للعرض المباشر في المتصفح. اتبع هذه القواعد بدقة:

1. ابدأ الرد بـ <!DOCTYPE html> وأنهه بـ </html> — لا تكتب أي نص خارج كتلة HTML.
2. ضمّن في <style> داخل <head>:
   @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
   :root{--navy:#1B3A6B;--navy-d:#0D2040;--gold:#C9A84C;--silver:#9BA8B8;--silver-l:#EEF2F7;}
   *{box-sizing:border-box;margin:0;padding:0;}
   body{font-family:'Cairo',sans-serif;direction:rtl;background:#F0F4FA;color:#1a1a1a;line-height:1.75;}
   .container{max-width:980px;margin:0 auto;padding:36px 28px;background:#fff;}
   /* ── Header ── */
   .study-header{background:linear-gradient(135deg,#0D2040 0%,#1B3A6B 60%,#2A5298 100%);color:#fff;padding:28px 32px;border-radius:12px;margin-bottom:28px;border-bottom:3px solid #C9A84C;}
   .study-header h1{font-size:24px;font-weight:900;color:#fff;margin-bottom:6px;}
   .study-header .subtitle{font-size:13px;color:#9BA8B8;}
   /* ── Headings ── */
   h2{background:var(--navy);color:#fff;padding:12px 20px;border-radius:6px 6px 0 0;border-right:5px solid var(--gold);font-size:16px;font-weight:800;margin-top:28px;margin-bottom:0;}
   h3{color:var(--gold);border-bottom:2px solid var(--silver);padding-bottom:6px;margin:20px 0 12px;font-size:14px;font-weight:700;}
   /* ── Tables ── */
   .tbl-wrap{border:1px solid #dde3ec;border-radius:0 0 6px 6px;overflow:hidden;margin-bottom:20px;}
   table{border-collapse:collapse;width:100%;}
   th{background:var(--navy);color:var(--gold);padding:10px 14px;font-size:12px;font-weight:700;text-align:right;}
   td{padding:9px 14px;font-size:13px;border-bottom:1px solid #eaeef5;text-align:right;}
   tr:nth-child(even) td{background:var(--silver-l);}
   tr:hover td{background:#e4eaf5;}
   /* ── TOTAL ROW ── */
   tr.total td{background:var(--navy-d);color:var(--gold);font-weight:800;font-size:14px;border-top:2px solid var(--gold);}
   /* ── Summary card ── */
   .summary-card{background:linear-gradient(135deg,var(--navy-d),var(--navy));color:#fff;padding:22px 26px;border-radius:10px;border:1px solid var(--gold);margin-bottom:24px;}
   .summary-card p{color:#CBD5E1;line-height:1.8;font-size:14px;}
   /* ── KPI row ── */
   .kpi-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px;}
   .kpi{background:var(--silver-l);border:1px solid #dde3ec;border-radius:8px;padding:16px;text-align:center;border-top:3px solid var(--navy);}
   .kpi-val{font-size:20px;font-weight:800;color:var(--navy);}
   .kpi-lbl{font-size:11px;color:#64748B;margin-top:4px;}
   /* ── Numbers ── */
   .num{color:var(--gold);font-weight:700;}
   /* ── Warning box ── */
   .note{background:#FFFBEB;border-right:4px solid var(--gold);padding:12px 16px;border-radius:4px;font-size:13px;color:#78350F;margin:16px 0;}
   /* ── Print ── */
   @media print{body{background:#fff;}.container{padding:16px;}}
3. استخدم <div class="container"> لكل المحتوى.
4. ابدأ بـ <div class="study-header"> يحتوي h1 باسم المشروع وp.subtitle بنوعه وتاريخ الدراسة.
5. ضع KPIs رئيسية (إجمالي التكلفة، مدة التنفيذ، ROI) في <div class="kpi-row"> مباشرةً بعد الهيدر.
6. الملخص التنفيذي في <div class="summary-card">.
7. كل قسم رئيسي يبدأ بـ <h2>، الأقسام الفرعية بـ <h3>.
8. كل جدول في <div class="tbl-wrap"><table>، صف الإجمالي يحمل <tr class="total">.
9. الأرقام المالية تُلفّ بـ <span class="num">.
10. التحذيرات والملاحظات في <div class="note">.
11. العملة: الجنيه المصري (ج.م) — قدّم نطاقاً (الحد الأدنى — الحد الأقصى).
12. أضف هامش احتياطي 10% على التكاليف.
13. استند على أسعار السوق المصري الحالية من خبرتك.
14. وضّح أن هذه دراسة تقديرية وليست أسعاراً نهائية.`;
}

// ── Standard real estate prompt ───────────────────────────────────────────────

function buildStandardPrompt(d: StudyFormData): string {
  const subType = SUBTYPE_LABEL[d.realEstateSubType || ''] ?? 'عقاري';
  const method  = d.method === 'fast' ? 'تقريبية (80%+)' : 'تفصيلية كاملة (BOQ)';

  const finishing = FINISHING_LABEL[d.finishingLevel || ''] ?? d.finishingLevel ?? 'غير محدد';
  const basement  = BASEMENT_LABEL[d.basement || 'none'] ?? 'لا يوجد';

  // Mixed-use floor distribution
  const MIXED_LABELS: Record<string, string> = {
    residential: 'سكني', commercial: 'تجاري', administrative: 'إداري',
    medical: 'طبي', hotel: 'فندقي',
  };
  let mixedSection = '';
  if (d.projectType === 'mixed') {
    const activeSectors = ['residential', 'commercial', 'administrative', 'medical', 'hotel']
      .filter(k => k === 'residential' || d[`mixedHas_${k}`] === 'true');
    const floorLines = activeSectors.map(k => {
      const floors = d[`mixedFloors_${k}`];
      return `  - ${MIXED_LABELS[k]}: ${floors || 'غير محدد'}`;
    });
    mixedSection = `\n=== توزيع الأدوار (مختلط) ===\n${floorLines.join('\n')}`;
  }

  const ownershipLabel = OWNERSHIP_LABEL[d.ownershipType || 'full'] ?? 'ملكية ثابتة';
  const partnershipLine = d.ownershipType === 'partnership'
    ? `\n- نسبة مالك الأرض: ${val(d.ownerShare)}\n- نسبة المطور: ${val(d.developerShare)}`
    : '';

  const fields = [
    labeled('مساحة الأرض', d.landArea),
    labeled('سعر متر الأرض', d.landPrice),
    labeled('مساحة البناء المقررة', d.constructionArea),
    labeled('عدد الأدوار', d.floorsCount),
    `- البدروم: ${basement}`,
    `- مستوى التشطيب: ${finishing}`,
    `- نوع الملكية: ${ownershipLabel}${partnershipLine}`,
    labeled('نوع المشروع التفصيلي', d.projectType),
    labeled('وصف المشروع', d.description),
  ].filter(Boolean).join('\n');

  const detailLevel = d.method === 'fast'
    ? `3. تقدير التكلفة التقريبية (نطاق الحد الأدنى — الحد الأقصى) بالجنيه المصري
4. جدول زمني أولي
5. تحليل مالي أولي (ROI، فترة الاسترداد)`
    : `3. تفصيل BOQ بند بند (تأسيس — هيكل — تشطيب — ميكانيكا وكهرباء)
4. جدول زمني تفصيلي بالمراحل
5. تحليل مالي شامل (ROI، التدفقات النقدية، فترة الاسترداد، نقطة التعادل)`;

  return `أنت خبير متخصص في دراسات الجدوى العقارية والإنشائية في مصر، لديك خبرة واسعة بأسعار السوق المصري الحالية.

=== بيانات المشروع ===
- اسم المشروع: ${val(d.projectName)}
- نوع المشروع: ${subType}
- الموقع: ${val(d.location)}
- دقة الدراسة: ${method}
${fields}
${mixedSection}

=== المطلوب ===
أعد دراسة جدوى شاملة باللغة العربية تشمل:

1. ملخص تنفيذي (3-5 أسطر)
2. تحليل الموقع والبنية التحتية
${detailLevel}
6. تقييم المخاطر والتوصيات

=== قواعد الإخراج — HTML كامل (ألوان: أسود + ذهبي) ===
أخرج الدراسة كاملةً بصيغة HTML صالحة للعرض المباشر في المتصفح. اتبع هذه القواعد بدقة:

1. ابدأ الرد بـ <!DOCTYPE html> وأنهه بـ </html> — لا تكتب أي نص خارج كتلة HTML.
2. ضمّن الخطوط والأنماط داخل <style> في <head>:
   @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
   :root { --black:#1a1a1a; --gold:#C9A84C; --gold-l:#FFF8DC; }
   body { font-family:'Cairo',sans-serif; direction:rtl; background:#F5F5F0; color:#1a1a1a; line-height:1.7; }
   .container { max-width:960px; margin:0 auto; padding:32px 24px; background:#fff; }
3. العناوين الرئيسية h2: خلفية #1a1a1a، لون أبيض، حد ذهبي يسار 5px بلون #C9A84C، حشو 14px 20px.
4. العناوين الفرعية h3: لون #C9A84C، حد سفلي 2px بلون #C9A84C، حشو سفلي 6px.
5. الجداول: border-collapse:collapse، عرض 100%، رأس الجدول bg:#1a1a1a لون:#C9A84C (ذهبي)، صفوف متناوبة #fafafa / أبيض، حدود #e0e0e0.
6. **صف الإجمالي في كل جدول**: خلفية #2C2C2C، لون #C9A84C، خط عريض — يميّزه تمييزاً واضحاً.
7. بطاقة الملخص التنفيذي: خلفية #1a1a1a، لون #C9A84C، حشو 20px، border-radius 8px.
8. الأرقام المالية: لون #C9A84C وخط عريض، بفواصل (مثلاً 1,500,000 ج.م).
9. صناديق التحذير/الملاحظات: خلفية #FFF8DC، حد يسار 4px #C9A84C.
10. العملة: الجنيه المصري (ج.م) — قدّم نطاقاً (الحد الأدنى — الحد الأقصى).
11. أضف هامش احتياطي 10% على التكاليف.
12. استند على أسعار السوق المصري الحالية من خبرتك.
13. وضّح أن هذه دراسة تقديرية وليست أسعاراً نهائية.`;
}

// ── Builder export ────────────────────────────────────────────────────────────

// ── Renovation prompt ────────────────────────────────────────────────────────

function buildRenovationPrompt(d: StudyFormData): string {
  const imageCount = d.renovationImages
    ? JSON.parse(d.renovationImages).length
    : 0;

  return `أنت خبير متخصص في أعمال الترميم والإصلاح الإنشائي في مصر، لديك خبرة واسعة بأسعار مواد البناء والعمالة الحالية.

=== بيانات مشروع الترميم ===
- اسم المشروع: ${val(d.projectName)}
- الموقع: ${val(d.location)}
- عدد الصور المرفقة: ${imageCount} صورة
- وصف حالة المبنى والأعمال المطلوبة:

${val(d.renovationDescription, 'لم يُذكر وصف')}

=== المطلوب ===
بناءً على الوصف أعلاه، أعد دراسة جدوى ترميم شاملة باللغة العربية تشمل:

1. تشخيص المشكلات الإنشائية المذكورة وتصنيفها (عاجل / مهم / تحسين)
2. قائمة تفصيلية بالأعمال المطلوبة
3. جدول التكاليف التقديرية لكل بند (مواد + عمالة) بالجنيه المصري
4. الأولويات المقترحة للتنفيذ (المرحلة الأولى: العاجل — المرحلة الثانية: الباقي)
5. جدول زمني مقترح
6. تحذيرات واحتياطات السلامة إن وُجدت

=== قواعد الإخراج — HTML كامل (ألوان: أسود + ذهبي) ===
أخرج الدراسة كاملةً بصيغة HTML صالحة للعرض المباشر في المتصفح. اتبع هذه القواعد:

1. ابدأ الرد بـ <!DOCTYPE html> وأنهه بـ </html> — لا تكتب أي نص خارج كتلة HTML.
2. @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
   body { font-family:'Cairo',sans-serif; direction:rtl; background:#F5F5F0; color:#1a1a1a; }
   .container { max-width:960px; margin:0 auto; padding:32px 24px; background:#fff; }
3. h2: خلفية #1a1a1a، لون أبيض، حد ذهبي يسار 5px بلون #C9A84C.
4. h3: لون #C9A84C، حد سفلي 2px بلون #C9A84C.
5. الجداول: رأس الجدول bg:#1a1a1a لون:#C9A84C، صفوف متناوبة، حدود #e0e0e0.
6. صف الإجمالي: خلفية #2C2C2C، لون #C9A84C، خط عريض.
7. الأعمال العاجلة: صندوق بخلفية #FFF0F0 وحد أحمر #DC2626.
8. الأرقام المالية: لون #C9A84C وخط عريض.
9. أضف هامش احتياطي 15% على التكاليف (الترميم عادة يظهر مفاجآت).
10. وضّح أن هذه تقديرات مبدئية وقد تتغير بعد الكشف الميداني المباشر.`;
}

// ── Builder export ────────────────────────────────────────────────────────────

// ── Finishing prompt ──────────────────────────────────────────────────────────

const UNIT_TYPE_LABEL: Record<string, string> = {
  apartment: 'شقة سكنية', villa: 'فيلا', clinic: 'عيادة',
  medical: 'مبنى طبي', commercial: 'تجاري', admin: 'إداري',
  hotel: 'فندقي', mixed: 'مختلط',
};
const FINISHING_LEVEL_LABEL: Record<string, string> = {
  normal: 'عادي', medium: 'متوسط', premium: 'راقي', luxury: 'فندقي فاخر',
};

function buildFinishingPrompt(d: StudyFormData): string {
  const unitType      = UNIT_TYPE_LABEL[d.finishingUnitType || ''] ?? 'وحدة';
  const level         = FINISHING_LEVEL_LABEL[d.finishingLevel || ''] ?? 'متوسط';
  const isResidential = d.finishingUnitType === 'apartment' || d.finishingUnitType === 'villa';

  const ceilingRaw    = d.ceilingHeight === 'custom' ? d.ceilingHeightCustom : d.ceilingHeight;
  const ceilingNote   = ceilingRaw
    ? `- ارتفاع الدور: ${ceilingRaw} م${ceilingRaw !== '3.6' ? ' (يختلف عن المعيار المصري 3.6م — احسب التكاليف على الارتفاع الفعلي)' : ' (مطابق للكود المصري)'}`
    : '- ارتفاع الدور: 3.6م (المعيار المصري للكود البنائي)';

  const docCount = d.officialDocs ? JSON.parse(d.officialDocs).length : 0;
  const docNote  = docCount > 0
    ? `\n- وثائق رسمية مرفقة: ${docCount} وثيقة (رسم مساحي / رخصة / صك ملكية) — استند إليها في التحليل`
    : '';

  const details = [
    d.unitArea      && `- المساحة الإجمالية: ${d.unitArea} م²`,
    d.floorsCount   && `- عدد الأدوار: ${d.floorsCount}`,
    isResidential && d.roomsCount     && `- عدد الغرف: ${d.roomsCount}`,
    isResidential && d.bathroomsCount && `- عدد الحمامات: ${d.bathroomsCount}`,
    d.finishingUnitType === 'mixed' && d.mixedFloorDesc && `- توزيع الأدوار: ${d.mixedFloorDesc}`,
    ceilingNote,
    d.location    && `- الموقع: ${d.location}`,
    d.description && `- ملاحظات: ${d.description}`,
  ].filter(Boolean).join('\n');

  const phasedSections = isResidential ? `
أهم شيء في الدراسة: اجعل كل بند **مستقلاً تماماً** بتكلفته وجدوله الزمني حتى يتمكن العميل من التشطيب على مراحل منفصلة.
قسّم الدراسة إلى البنود التالية، كل بند في قسم مستقل بجدول تكلفة خاص به:

البند 1 — التشطيب الخشن (بياض + عزل + أسقف خرسانية)
البند 2 — الأرضيات والتكسيات (سيراميك / بورسلان / رخام / باركيه)
البند 3 — الكهرباء والإضاءة (لوحات — أسلاك — نقاط — إضاءة)
البند 4 — السباكة والصرف الصحي (مواسير — وصلات — بوتاجاز)
البند 5 — التكييف (وحدات — تمديدات — تهوية)
البند 6 — الحمامات (سانتري — بلاط — إكسسوارات — مرايا)
البند 7 — المطبخ (جرانيت — خزائن — إكسسوارات)
البند 8 — النجارة والأبواب (أبواب داخلية — دواليب — شبابيك)
البند 9 — الديكور والجبس بورد (أسقف مشغولة — جبسيات — دهانات نهائية)

لكل بند: جدول مواد + عمالة + إجمالي + مدة التنفيذ المقترحة.
في النهاية: جدول ملخص بتكلفة كل بند والإجمالي الكلي.`
    : `قسّم الدراسة إلى:
- أعمال التشطيب الخشن (بياض — عزل — أسقف)
- أرضيات وجدران (حسب المستوى)
- أعمال النجارة والأبواب
- أعمال الحمامات والسانتري
- أعمال الكهرباء والإضاءة
- أعمال السباكة والتكييف
- ديكور وجبس بورد (حسب المستوى)`;

  return `أنت خبير متخصص في أعمال التشطيب والديكور الداخلي في مصر، لديك خبرة واسعة بأسعار المواد والعمالة الحالية في السوق المصري وبمتطلبات الكود المصري للبناء.

=== بيانات مشروع التشطيب ===
- اسم المشروع: ${val(d.projectName)}
- نوع الوحدة: ${unitType}
- مستوى التشطيب المطلوب: ${level}${docNote}
${details}

=== المطلوب ===
أعد دراسة تشطيب شاملة باللغة العربية تشمل:

1. ملخص تنفيذي — نوع الوحدة ومستوى التشطيب والتكلفة الإجمالية المتوقعة
2. ${phasedSections}
3. إجمالي التكلفة بالجنيه المصري مع نطاق (الحد الأدنى — الحد الأقصى)
4. جدول زمني مقترح للتنفيذ
5. ملاحظات على مطابقة المواصفات للكود المصري للبناء

=== قواعد الإخراج — HTML كامل (ألوان: أسود + ذهبي) ===
أخرج الدراسة كاملةً بصيغة HTML. اتبع هذه القواعد:

1. ابدأ بـ <!DOCTYPE html> وأنهه بـ </html>.
2. @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
   body { font-family:'Cairo',sans-serif; direction:rtl; background:#F5F5F0; color:#1a1a1a; }
   .container { max-width:960px; margin:0 auto; padding:32px 24px; background:#fff; }
3. h2: خلفية #1a1a1a، لون أبيض، حد ذهبي يسار 5px بلون #C9A84C.
4. h3: لون #C9A84C، حد سفلي 2px بلون #C9A84C.
5. الجداول: رأس الجدول bg:#1a1a1a لون:#C9A84C، صفوف متناوبة، حدود #e0e0e0.
6. صف الإجمالي: خلفية #2C2C2C، لون #C9A84C، خط عريض.
7. الأرقام المالية: لون #C9A84C وخط عريض بفواصل.
8. أضف هامش احتياطي 10% على التكاليف.
9. وضّح أن هذه تقديرات مبدئية وتختلف بحسب العروض الفعلية في السوق.`;
}

// ── Efficiency / Fit-out prompt ───────────────────────────────────────────────

const ACTIVITY_LABEL: Record<string, string> = {
  bank: 'بنك / فرع بنكي', hypermarket: 'هايبر ماركت', fashion: 'محل ملابس',
  pharmacy: 'صيدلية', restaurant: 'مطعم', cafe: 'كافيه',
  clinic: 'عيادة / مركز طبي', gym: 'جيم / نادي رياضي',
  office: 'مكاتب إدارية', showroom: 'معرض / شوروم',
  hotel: 'فندق / شقق فندقية', other: 'نشاط تجاري',
};

const FINISHING_LABEL_EFF: Record<string, string> = {
  normal: 'عادي', medium: 'متوسط', premium: 'راقي', luxury: 'فندقي فاخر',
};

function buildEfficiencyPrompt(d: StudyFormData): string {
  const activity = d.activityType === 'other'
    ? (d.activityCustomName || 'نشاط تجاري')
    : (ACTIVITY_LABEL[d.activityType || ''] ?? 'نشاط تجاري');

  const brand    = d.brandName ? `\n- البراند / الشركة: ${d.brandName}` : '';
  const finishing = d.targetFinishing ? `\n- مستوى التشطيب المستهدف: ${FINISHING_LABEL_EFF[d.targetFinishing] ?? d.targetFinishing}` : '';

  const currentImgCount = d.currentStateImages ? JSON.parse(d.currentStateImages).length : 0;
  const targetImgCount  = d.targetStateImages  ? JSON.parse(d.targetStateImages).length  : 0;

  const currentDesc = d.currentStateDesc ? `\n- وصف الحالة الراهنة: ${d.currentStateDesc}` : '';
  const targetDesc  = d.targetStateDesc  ? `\n- وصف المطلوب: ${d.targetStateDesc}`          : '';

  return `أنت خبير متخصص في أعمال الفيت-أوت والتطوير الداخلي للمحلات التجارية والمرافق في مصر، لديك خبرة واسعة بأسعار السوق الحالية وتطبيق هويات البراندات الكبرى.

=== بيانات مشروع رفع الكفاءة ===
- اسم المشروع: ${val(d.projectName)}
- نوع النشاط: ${activity}${brand}
- الموقع: ${val(d.location)}
- المساحة الإجمالية: ${val(d.totalArea)} م²
- عدد الأدوار: ${val(d.floorsCount)}${finishing}

=== الواقع الحالي ===
- صور الحالة الراهنة المرفقة: ${currentImgCount} صورة${currentDesc}

=== المطلوب تنفيذه ===
- صور مرجعية مرفقة: ${targetImgCount} صورة${targetDesc}

=== المطلوب ===
أعد دراسة جدوى رفع كفاءة شاملة باللغة العربية تشمل:

1. ملخص تنفيذي — طبيعة المشروع وهدفه
2. قائمة الأعمال المطلوبة مقسّمة إلى:
   - أعمال هدم وإزالة
   - أعمال إنشائية وتشطيب (أرضيات، أسقف، جدران)
   - أعمال كهرباء وإضاءة
   - أعمال تكييف وميكانيكا
   - أعمال ديكور وهوية بصرية (برشلف — كاونترات — لافتات)
3. جدول تكاليف تفصيلي لكل بند (مواد + عمالة + توريد) بالجنيه المصري
4. إجمالي التكلفة التقديرية (الحد الأدنى — الحد الأقصى)
5. جدول زمني مقترح للتنفيذ
6. ملاحظات خاصة بالنشاط (${activity}) — معايير الجودة والمواصفات المعتادة لهذا النوع

=== قواعد الإخراج — HTML كامل (ألوان: أسود + ذهبي) ===
أخرج الدراسة كاملةً بصيغة HTML. اتبع هذه القواعد:

1. ابدأ بـ <!DOCTYPE html> وأنهه بـ </html>.
2. @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
   body { font-family:'Cairo',sans-serif; direction:rtl; background:#F5F5F0; color:#1a1a1a; }
   .container { max-width:960px; margin:0 auto; padding:32px 24px; background:#fff; }
3. h2: خلفية #1a1a1a، لون أبيض، حد ذهبي يسار 5px بلون #C9A84C.
4. h3: لون #C9A84C، حد سفلي 2px بلون #C9A84C.
5. الجداول: رأس الجدول bg:#1a1a1a لون:#C9A84C، صفوف متناوبة، حدود #e0e0e0.
6. صف الإجمالي: خلفية #2C2C2C، لون #C9A84C، خط عريض.
7. الأرقام المالية: لون #C9A84C وخط عريض بفواصل.
8. أضف هامش احتياطي 10% على التكاليف.
9. وضّح أن هذه تقديرات مبدئية قبل الكشف الميداني النهائي.`;
}

// ── Builder export ────────────────────────────────────────────────────────────

export const realEstateBuilder: PromptBuilder = {
  getCategory() { return 'realEstate'; },

  buildPrompt(formData: StudyFormData): string {
    if (formData.realEstateSubType === 'integrated') {
      return buildIntegratedPrompt(formData);
    }
    if (formData.realEstateSubType === 'renovation') {
      return buildRenovationPrompt(formData);
    }
    if (formData.realEstateSubType === 'efficiency') {
      return buildEfficiencyPrompt(formData);
    }
    if (formData.realEstateSubType === 'finishing') {
      return buildFinishingPrompt(formData);
    }
    return buildStandardPrompt(formData);
  },
};
