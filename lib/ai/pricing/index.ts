// Pricing data exports
import { agriculturalPricing, formatAgriculturalPricing } from './agricultural';

export { agriculturalPricing, formatAgriculturalPricing };

// Generic pricing formatter interface
export interface PricingFormatter {
  format(): string;
}

// Map of pricing formatters by category
export const pricingFormatters: Record<string, PricingFormatter | null> = {
  agricultural: { format: formatAgriculturalPricing },
  // Add more formatters as we create pricing data for other categories
};

// Get formatted pricing for a category
export function getFormattedPricing(category: string): string {
  const formatter = pricingFormatters[category];
  if (formatter) {
    return formatter.format();
  }
  // Fallback to generic pricing data
  return '';
}