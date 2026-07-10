import fs from 'fs';
import path from 'path';

const RATES_PATH = path.join(process.cwd(), 'lib', 'pricing', 'construction-rates.json');

type IndirectItem = { label: string; rate: number; requires_finishing?: boolean };

interface RatesData {
  _meta: { year: number; note: string };
  structural: {
    label: string;
    items: Record<string, { label: string; price: number; unit: string }>;
    basement_multiplier: { table: Record<string, number>; note: string };
  };
  finishing: { label: string; items: Record<string, { label: string; price: number; unit: string }> };
  mep:       { label: string; items: Record<string, { label: string; price: number; unit: string }> };
  indirect_costs: {
    label: string;
    items: Record<string, IndirectItem>;
    total_indirect_rate: number;
  };
  total_cost_benchmarks: {
    label: string;
    levels: Record<string, { label: string; min: number; max: number }>;
  };
}

let rawData: RatesData | null = null;

function loadData(): RatesData {
  if (rawData) return rawData;
  rawData = JSON.parse(fs.readFileSync(RATES_PATH, 'utf-8')) as RatesData;
  return rawData;
}

export function getConstructionRatesPrompt(finishingLevel?: string): string {
  const r = loadData();
  const hasFinishing = finishingLevel && finishingLevel !== 'none';
  const fmt = (n: number) => n.toLocaleString('ar-EG');

  // ── Structural ──
  const structRows = Object.values(r.structural.items)
    .map(i => `  • ${i.label}: ${fmt(i.price)} ${i.unit}`)
    .join('\n');

  const basementRows = Object.entries(r.structural.basement_multiplier.table)
    .map(([k, v]) => `  ${k === '0' ? 'بدون بدروم' : k + ' بدروم'}: ×${v}`)
    .join('\n');

  // ── Finishing ──
  const finishRows = hasFinishing
    ? Object.values(r.finishing.items)
        .map(i => `  • ${i.label}: ${fmt(i.price)} ${i.unit}`)
        .join('\n')
    : '  (لا تُدرج — المشروع بدون تشطيب)';

  // ── MEP ──
  const mepRows = Object.values(r.mep.items)
    .map(i => `  • ${i.label}: ${fmt(i.price)} ${i.unit}`)
    .join('\n');

  // ── Indirect — exclude decoration when no finishing ──
  const activeIndirect = Object.values(r.indirect_costs.items)
    .filter(i => hasFinishing || !i.requires_finishing);

  const indirectRows = activeIndirect
    .map(i => `  • ${i.label}: ${(i.rate * 100).toFixed(2)}%`)
    .join('\n');

  const totalIndirectRate = activeIndirect.reduce((sum, i) => sum + i.rate, 0);
  const totalIndirectPct  = (totalIndirectRate * 100).toFixed(1);

  // ── Benchmarks ──
  const benchmarkRows = Object.values(r.total_cost_benchmarks.levels)
    .map(l => `  • ${l.label}: ${fmt(l.min)} – ${fmt(l.max)} ج.م/م²`)
    .join('\n');

  const finishingNote = !hasFinishing
    ? '\n⚠️ المشروع بدون تشطيب — استبعد بنود التشطيب والديكور تماماً من الحساب.'
    : '';

  return `
╔══════════════════════════════════════════════════════════════════╗
║        قاعدة أسعار البناء المعتمدة — مصر ${r._meta.year}
║        ${r._meta.note}
╚══════════════════════════════════════════════════════════════════╝
${finishingNote}

【 الهيكل الإنشائي 】
${structRows}

【 معامل البدرومات — يُطبَّق على الأساسات والحفر فقط 】
${basementRows}
  (${r.structural.basement_multiplier.note})

【 التشطيبات 】
${finishRows}

【 الأعمال الميكانيكية والكهربائية (MEP) 】
${mepRows}

【 التكاليف غير المباشرة — تُضاف على الإجمالي المباشر 】
${indirectRows}
  ── الإجمالي غير المباشر: ${totalIndirectPct}%

【 مرجع التكلفة الكلية حسب مستوى المشروع 】
${benchmarkRows}

⚠️ استخدم هذه الأرقام حصرياً في حساباتك — لا تخترع أرقاماً من خارجها.
`.trim();
}
