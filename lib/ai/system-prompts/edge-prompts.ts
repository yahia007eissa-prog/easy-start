// Edge-compatible system prompts loader
// Uses default prompts since file system is not available in edge runtime

import type { ProjectCategory } from '@/lib/ai/system-prompts/dynamic-prompts';

// Default prompts for edge runtime (no file system access)
const DEFAULT_PROMPTS: Record<ProjectCategory, string> = {
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

export function getEdgeSystemPrompt(category: ProjectCategory): string {
  return DEFAULT_PROMPTS[category] || DEFAULT_PROMPTS.realEstate;
}
