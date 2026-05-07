// Dynamic pricing loader
// Reads pricing from JSON config file for runtime modification

import fs from 'fs';
import path from 'path';

export type PricingCategory = 'realEstate' | 'medical' | 'agricultural' | 'industrial' | 'global';

export interface PricingSubType {
  constructionPerSqm?: Record<string, number>;
  basementAddition?: Record<string, number>;
  perFeddan?: Record<string, number>;
  perSqm?: Record<string, number>;
}

export interface PricingConfig {
  name: string;
  nameAr: string;
  data: Record<string, PricingSubType>;
  updatedAt: string;
}

export interface AdditionalCosts {
  electricalPerSqm: number;
  plumbingPerSqm: number;
  hvacPerSqm: number;
  elevatorPerUnit: number;
  parkingPerSqm: number;
  landscapingPerSqm: number;
  consultingPercent: number;
  licensingPercent: number;
  contingencyPercent: number;
  [key: string]: number;
}

export interface PricingNotes {
  allPricesInEGP: string;
  accuracyNote: string;
  exchangeRate: string;
  updateFrequency: string;
  [key: string]: string;
}

export interface GlobalPricingData {
  finishingLevels: Record<string, string>;
  additionalCosts: AdditionalCosts;
  notes: PricingNotes;
  updatedAt?: string;
  [key: string]: unknown;
}

interface PricingConfigFile {
  [key: string]: PricingConfig | GlobalPricingData;
}

const CONFIG_PATH = path.join(process.cwd(), 'lib', 'ai', 'pricing-config.json');

// In-memory cache
let pricingCache: PricingConfigFile | null = null;
let lastReadTime: number = 0;
const CACHE_TTL = 5000; // 5 seconds cache

function readPricingConfig(): PricingConfigFile {
  const now = Date.now();

  // Return cache if still valid
  if (pricingCache && (now - lastReadTime) < CACHE_TTL) {
    return pricingCache;
  }

  try {
    const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
    pricingCache = JSON.parse(fileContent) as PricingConfigFile;
    lastReadTime = now;
    return pricingCache;
  } catch (error) {
    console.error('[DynamicPricing] Failed to read pricing config:', error);
    return {};
  }
}

export function getPricingData(category: PricingCategory): PricingConfig | null {
  const config = readPricingConfig();

  if (category === 'global') {
    // Return global data (finishing levels, additional costs, notes)
    const globalData = config['global'];
    if (globalData) {
      return {
        name: 'Global Settings',
        nameAr: 'الإعدادات العامة',
        data: globalData as unknown as Record<string, PricingSubType>,
        updatedAt: (globalData as { updatedAt?: string }).updatedAt || new Date().toISOString(),
      };
    }
    return null;
  }

  const categoryConfig = config[category];
  if (categoryConfig && 'data' in categoryConfig) {
    return categoryConfig as PricingConfig;
  }
  return null;
}

export function getAllCategories(): PricingCategory[] {
  return ['realEstate', 'medical', 'agricultural', 'industrial', 'global'];
}

export function getPricingConfigList(): Array<{ category: PricingCategory; info: PricingConfig }> {
  const config = readPricingConfig();
  const validCategories: PricingCategory[] = ['realEstate', 'medical', 'agricultural', 'industrial', 'global'];

  return validCategories
    .map(category => {
      const categoryConfig = config[category];
      if (categoryConfig && 'data' in categoryConfig) {
        return {
          category,
          info: categoryConfig as PricingConfig,
        };
      }
      // Return default info if not found
      return {
        category,
        info: getDefaultPricing(category),
      };
    });
}

export function updatePricing(category: PricingCategory, data: Record<string, unknown>): boolean {
  try {
    const config = readPricingConfig();

    // Validate JSON data
    const jsonData = JSON.stringify(data, null, 2);

    // Update the config
    if (!config[category]) {
      config[category] = {
        name: getCategoryName(category),
        nameAr: getCategoryNameAr(category),
        data: {},
        updatedAt: new Date().toISOString(),
      };
    }

    if (category === 'global') {
      // For global, data contains finishingLevels, additionalCosts, notes
      (config[category] as GlobalPricingData) = {
        ...(config[category] as GlobalPricingData),
        ...(data as Partial<GlobalPricingData>),
        updatedAt: new Date().toISOString(),
      };
    } else {
      // For categories, data is the category-specific pricing
      (config[category] as PricingConfig) = {
        ...(config[category] as PricingConfig),
        data: data as Record<string, PricingSubType>,
        updatedAt: new Date().toISOString(),
      };
    }

    // Write back to file
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');

    // Clear cache
    pricingCache = null;
    lastReadTime = 0;

    console.log(`[DynamicPricing] Updated pricing for category: ${category}`);
    return true;
  } catch (error) {
    console.error(`[DynamicPricing] Failed to update pricing for ${category}:`, error);
    return false;
  }
}

function getCategoryName(category: PricingCategory): string {
  const names: Record<PricingCategory, string> = {
    realEstate: 'Real Estate',
    medical: 'Medical & Health',
    agricultural: 'Agricultural',
    industrial: 'Industrial',
    global: 'Global Settings',
  };
  return names[category];
}

function getCategoryNameAr(category: PricingCategory): string {
  const names: Record<PricingCategory, string> = {
    realEstate: 'عقاري',
    medical: 'طبي وصحي',
    agricultural: 'زراعي',
    industrial: 'صناعي',
    global: 'الإعدادات العامة',
  };
  return names[category];
}

function getDefaultPricing(category: PricingCategory): PricingConfig {
  return {
    name: getCategoryName(category),
    nameAr: getCategoryNameAr(category),
    data: {},
    updatedAt: new Date().toISOString(),
  };
}

// Export raw pricing data for the study generation
export function getRawPricingData(category: PricingCategory): Record<string, unknown> | null {
  const config = getPricingData(category);
  if (!config) return null;
  return config.data;
}

// Get all pricing combined (for study generation)
export function getCombinedPricingData(): {
  [key: string]: Record<string, unknown>;
} {
  const config = readPricingConfig();
  const result: Record<string, Record<string, unknown>> = {};

  const categories: PricingCategory[] = ['realEstate', 'medical', 'agricultural', 'industrial'];
  for (const cat of categories) {
    if (config[cat] && 'data' in config[cat]) {
      result[cat] = (config[cat] as PricingConfig).data;
    }
  }

  // Add global data
  if (config['global']) {
    result['finishingLevels'] = (config['global'] as GlobalPricingData).finishingLevels;
    result['additionalCosts'] = (config['global'] as GlobalPricingData).additionalCosts;
    result['notes'] = (config['global'] as GlobalPricingData).notes;
  }

  return result;
}
