// Prompt Builder Loader
// Auto-loads all prompt builders and registers them

import { registerBuilder, getBuilder, hasBuilder, getRegisteredCategories } from './registry';
import { defaultBuilder } from './default';
import { agriculturalBuilder } from './agricultural';
import { realEstateBuilder } from './realEstate';

// Auto-register all builders
function initializeBuilders() {
  // Real estate — uses dedicated builder with integrated subtype support
  registerBuilder('realEstate', realEstateBuilder);

  // Fallback default for medical and industrial
  registerBuilder('medical', defaultBuilder);
  registerBuilder('industrial', defaultBuilder);

  // Agricultural — specialized builder
  registerBuilder('agricultural', agriculturalBuilder);

  console.log('[PromptBuilderLoader] Registered builders:', getRegisteredCategories());
}

// Initialize on module load
initializeBuilders();

// Re-export for convenience
export { getBuilder, hasBuilder, getRegisteredCategories };
export { defaultBuilder };
export { agriculturalBuilder };

// Re-export for backward compatibility
export { buildAgriculturalPrompt, getCropTypeLabel, getIrrigationLabel, getWaterSourceLabel, getSoilTypeLabel } from './agricultural';
export { agriculturalPricing } from '@/lib/ai/pricing/agricultural';
export { agriculturalUserInputs, AGRICULTURAL_LABELS } from '@/lib/ai/system-prompts/agricultural-types';
export { agriculturalSystemPrompt } from '@/lib/ai/system-prompts/agricultural';
