// Dynamic system prompts loader
// Reads prompts from JSON config file for runtime modification

import fs from 'fs';
import path from 'path';

export type ProjectCategory = 'realEstate' | 'medical' | 'agricultural' | 'industrial';

export interface PromptConfig {
  name: string;
  nameAr: string;
  prompt: string;
  updatedAt: string;
}

interface PromptsConfig {
  [key: string]: PromptConfig;
}

const CONFIG_PATH = path.join(process.cwd(), 'lib', 'ai', 'system-prompts', 'prompts-config.json');

// In-memory cache
let promptsCache: PromptsConfig | null = null;
let lastReadTime: number = 0;
const CACHE_TTL = 5000; // 5 seconds cache

function readPromptsConfig(): PromptsConfig {
  const now = Date.now();

  // Return cache if still valid
  if (promptsCache && (now - lastReadTime) < CACHE_TTL) {
    return promptsCache;
  }

  try {
    const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
    promptsCache = JSON.parse(fileContent) as PromptsConfig;
    lastReadTime = now;
    return promptsCache;
  } catch (error) {
    console.error('[DynamicPrompts] Failed to read prompts config:', error);
    return {};
  }
}

export function getSystemPrompt(category: ProjectCategory): string {
  const config = readPromptsConfig();
  const categoryConfig = config[category];

  if (!categoryConfig?.prompt) {
    console.warn(`[DynamicPrompts] No prompt found for category: ${category}`);
    return getDefaultPrompt(category);
  }

  return categoryConfig.prompt;
}

export function getSystemPromptInfo(category: ProjectCategory): PromptConfig | null {
  const config = readPromptsConfig();
  return config[category] || null;
}

export function getAllCategories(): ProjectCategory[] {
  return ['realEstate', 'medical', 'agricultural', 'industrial'];
}

export function getAllPromptConfigs(): PromptConfig[] {
  const config = readPromptsConfig();
  return Object.values(config).filter(Boolean);
}

export function getPromptConfigList(): Array<{ category: ProjectCategory; info: PromptConfig }> {
  const config = readPromptsConfig();
  return Object.entries(config).map(([category, info]) => ({
    category: category as ProjectCategory,
    info,
  }));
}

// Write prompt to config file
export function updatePrompt(category: ProjectCategory, updates: Partial<PromptConfig>): boolean {
  try {
    const config = readPromptsConfig();

    if (!config[category]) {
      console.error(`[DynamicPrompts] Category ${category} does not exist`);
      return false;
    }

    // Update the config
    config[category] = {
      ...config[category],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Write back to file
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');

    // Clear cache
    promptsCache = null;
    lastReadTime = 0;

    console.log(`[DynamicPrompts] Updated prompt for category: ${category}`);
    return true;
  } catch (error) {
    console.error(`[DynamicPrompts] Failed to update prompt for ${category}:`, error);
    return false;
  }
}

// Default prompts as fallback
function getDefaultPrompt(category: ProjectCategory): string {
  const defaults: Record<ProjectCategory, string> = {
    realEstate: `# Easy Start — AI Construction Advisor

## Identity
You are the feasibility study advisor for Easy Start.

## Rules
- Respond in the same language as the user
- Never invent numbers
- Always use EGP for costs
- Add 10% contingency buffer`,
    medical: `# Easy Start — Medical Advisor

## Identity
You are the feasibility study advisor for Easy Start medical projects.`,
    agricultural: `# Easy Start — Agricultural Advisor

## Identity
You are the agricultural investment advisor for Easy Start.`,
    industrial: `# Easy Start — Industrial Advisor

## Identity
You are the feasibility study advisor for Easy Start industrial projects.`,
  };

  return defaults[category];
}