// Prompt Builder Types
// Shared interfaces for the prompt builder system

// Core form data with common fields shared by all categories
export interface StudyFormData {
  projectName: string;
  location: string;
  studyType: 'realEstate' | 'medical' | 'agricultural' | 'industrial';
  method: 'fast' | 'full';
  // Any additional fields from forms (category-specific)
  [key: string]: string | undefined;
}

// Category-specific form data extensions
export interface AgriculturalFormData extends StudyFormData {
  waterSource?: string;
  irrigationType?: string;
  soilType?: string;
  targetCrop?: string;
}

export interface RealEstateFormData extends StudyFormData {
  landArea?: string;
  constructionArea?: string;
  floorsCount?: string;
  basement?: string;
  finishingLevel?: string;
  projectType?: string;
}

export interface MedicalFormData extends StudyFormData {
  // Medical specific fields - to be defined
}

export interface IndustrialFormData extends StudyFormData {
  // Industrial specific fields - to be defined
}

// Form data union type
export type CategoryFormData = StudyFormData | AgriculturalFormData | RealEstateFormData | MedicalFormData | IndustrialFormData;

// Prompt builder interface - each category implements this
export interface PromptBuilder {
  getCategory(): string;
  buildPrompt(formData: StudyFormData): string;
}

// Module interface for lazy loading
export interface PromptBuilderModule {
  category: string;
  builder: PromptBuilder;
  priority?: number;
}

// Helper to check form data type
export function isAgriculturalFormData(data: StudyFormData): data is AgriculturalFormData {
  return data.studyType === 'agricultural';
}

export function isRealEstateFormData(data: StudyFormData): data is RealEstateFormData {
  return data.studyType === 'realEstate';
}

export function isMedicalFormData(data: StudyFormData): data is MedicalFormData {
  return data.studyType === 'medical';
}

export function isIndustrialFormData(data: StudyFormData): data is IndustrialFormData {
  return data.studyType === 'industrial';
}
