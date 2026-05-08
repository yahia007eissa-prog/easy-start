'use server';

import { deepseek, DEEPSEEK_MODEL } from '@/lib/ai/deepseek';
import { buildValuationPrompt, type ValuationFormData } from '@/lib/ai/prompt-builder/valuation';

export type { ValuationFormData } from '@/lib/ai/prompt-builder/valuation';

export interface ValuationResponse {
  success: boolean;
  reportText?: string;
  error?: string;
}

export async function generateValuation(data: ValuationFormData): Promise<ValuationResponse> {
  try {
    if (!data.location?.trim() || !data.area?.trim()) {
      return { success: false, error: 'الموقع والمساحة مطلوبان' };
    }

    const prompt = buildValuationPrompt(data);

    const completion = await deepseek.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const reportText = completion.choices?.[0]?.message?.content ?? '';
    if (!reportText) {
      return { success: false, error: 'لم يتم الحصول على رد من النظام' };
    }

    return { success: true, reportText };
  } catch (err) {
    console.error('[ValuationAction]', err);
    return { success: false, error: 'حدث خطأ أثناء إعداد التقييم' };
  }
}
