// Prompt Builder Registry
// Generic architecture for building prompts based on project category

import type { StudyFormData } from '@/app/actions/study';

// Types for prompt builder interface
export interface PricingFormatter {
  formatForPrompt(): string;
}

export interface PromptBuilder {
  buildPrompt(formData: StudyFormData): string;
  getCategory(): string;
}

// Registry to hold builders per category
const builders = new Map<string, PromptBuilder>();

// Register a builder for a category
export function registerBuilder(category: string, builder: PromptBuilder): void {
  builders.set(category, builder);
}

// Get builder for a category
export function getBuilder(category: string): PromptBuilder | undefined {
  return builders.get(category);
}

// Check if a builder exists for category
export function hasBuilder(category: string): boolean {
  return builders.has(category);
}

// Get all registered categories
export function getRegisteredCategories(): string[] {
  return Array.from(builders.keys());
}

// Generic prompt builder factory
export async function buildStudyPrompt(formData: StudyFormData): Promise<string> {
  const category = formData.studyType;
  const builder = builders.get(category);

  if (!builder) {
    console.warn(`[PromptBuilderRegistry] No builder found for category: ${category}, using default`);
    // Return a minimal prompt as fallback
    return `Generate a feasibility study for project: ${formData.projectName}`;
  }

  return builder.buildPrompt(formData);
}
