// Default Prompt Builder
// Used for realEstate, medical, and industrial categories

import { getSystemPrompt, type ProjectCategory } from '@/lib/ai/system-prompts';
import { formatPricingForPrompt } from '@/lib/ai/pricing-utils';
import { studyGenerationPrompt } from '@/app/actions/prompts/studyGeneration';
import type { PromptBuilder, PromptBuilderModule, StudyFormData } from './types';

// Default builder implementation
export const defaultBuilder: PromptBuilder = {
  getCategory() {
    return 'default';
  },

  buildPrompt(formData: StudyFormData): string {
    // Get system prompt based on project category
    const systemPrompt = getSystemPrompt(formData.studyType as ProjectCategory);

    // Build prompt with pricing data (use empty string if projectType is undefined)
    const pricingPrompt = formatPricingForPrompt(
      formData.studyType,
      formData.projectType || '',
    );

    const userPrompt = studyGenerationPrompt(formData, pricingPrompt);

    // Combine system prompt with user prompt
    return `${systemPrompt}\n\n${userPrompt}`;
  },
};

// Module export for auto-registration
export const defaultPromptBuilderModule: PromptBuilderModule = {
  category: 'default',
  builder: defaultBuilder,
  priority: 0, // Lower priority - used as fallback
};
