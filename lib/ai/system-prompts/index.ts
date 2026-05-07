// System prompts based on project type
// This file re-exports from dynamic-prompts.ts for backward compatibility

export {
  getSystemPrompt,
  getSystemPromptInfo,
  getAllCategories,
  getAllPromptConfigs,
  getPromptConfigList,
  updatePrompt,
  type ProjectCategory,
  type PromptConfig,
} from './dynamic-prompts';