// Agricultural Prompt Builder
// Specialized prompt builder for agricultural projects

import { agriculturalSystemPrompt } from '@/lib/ai/system-prompts/agricultural';
import { agriculturalUserInputs, AGRICULTURAL_LABELS } from '@/lib/ai/system-prompts/agricultural-types';
import { getPricingData } from '@/lib/ai/dynamic-pricing';
import type { PromptBuilder, PromptBuilderModule, AgriculturalFormData } from './types';
import type { StudyFormData } from '@/app/actions/study';
import fs from 'fs';
import path from 'path';

// Read HTML template from public/templates
function getAgriculturalTemplate(): string {
  try {
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'agricultural.html');
    return fs.readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error('[AgriculturalPromptBuilder] Failed to read template:', error);
    return '';
  }
}

// Format agricultural pricing from dynamic config
// Send raw JSON as reference for LLM to parse
function formatAgriculturalPricingFromConfig(): string {
  const config = getPricingData('agricultural');
  if (!config || !config.data) {
    return '⚠️ Pricing data not configured yet. Please add agricultural pricing in settings.';
  }

  // Send raw JSON data as-is for LLM to parse
  const jsonData = JSON.stringify(config.data, null, 2);

  return `### قاعدة بيانات الأسعار (EGP) ###

استخدم بيانات الأسعار التالية لحساب التكاليف:

\`\`\`json
${jsonData}
\`\`\``;
}

// Agricultural builder implementation
export const agriculturalBuilder: PromptBuilder = {
  getCategory(): string {
    return 'agricultural';
  },

  buildPrompt(formData: StudyFormData): string {
    const data = formData as AgriculturalFormData;
    const systemPrompt = agriculturalSystemPrompt;
    const userInputs = agriculturalUserInputs(data);
    const pricingData = formatAgriculturalPricingFromConfig();
    const htmlTemplate = getAgriculturalTemplate();

    // Combine all parts into a complete prompt
    return `${systemPrompt}

=== PRICING DATABASE ===

${pricingData}

=== USER INPUTS ===

${userInputs}

=== HTML TEMPLATE ===

التالي هو قالب HTML كامل مع CSS مدمج. استخدم هذا القالب كهيكل أساسي لدراسة الجدوى:

\`\`\`html
${htmlTemplate}
\`\`\`

=== TASK ===

Based on the pricing database, user inputs, and HTML template above:
1. Fill in ALL placeholders in the template ({{PROJECT_NAME}}, {{DATE}}, {{CATEGORY}}, {{CONTENT}}) with actual data from your analysis
2. Replace all example content with real project data based on user inputs
3. Calculate all costs, revenues, and profits using the pricing database
4. Keep the CSS styling exactly as-is - only modify the HTML content
5. Return the COMPLETE filled HTML document including DOCTYPE, html, head, body tags
6. Do NOT add any additional CSS or modify the existing styles
7. The output should be a valid, complete HTML document ready for display/download`;
  },
};

// Backward compatibility function
export function buildAgriculturalPrompt(formData: AgriculturalFormData): string {
  return agriculturalBuilder.buildPrompt(formData);
}

// Module export for auto-registration
export const agriculturalPromptBuilderModule: PromptBuilderModule = {
  category: 'agricultural',
  builder: agriculturalBuilder,
  priority: 100, // Higher priority - specific builders take precedence
};

export default agriculturalBuilder;

// Helper functions
export function getCropTypeLabel(cropType: string): string {
  return AGRICULTURAL_LABELS.cropTypes[cropType as keyof typeof AGRICULTURAL_LABELS.cropTypes] || cropType;
}

export function getIrrigationLabel(irrigationType: string): string {
  return AGRICULTURAL_LABELS.irrigationTypes[irrigationType as keyof typeof AGRICULTURAL_LABELS.irrigationTypes] || irrigationType;
}

export function getWaterSourceLabel(waterSource: string): string {
  return AGRICULTURAL_LABELS.waterSources[waterSource as keyof typeof AGRICULTURAL_LABELS.waterSources] || waterSource;
}

export function getSoilTypeLabel(soilType: string): string {
  return AGRICULTURAL_LABELS.soilTypes[soilType as keyof typeof AGRICULTURAL_LABELS.soilTypes] || soilType;
}
