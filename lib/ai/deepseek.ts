import OpenAI from 'openai';

let _deepseek: OpenAI | null = null;

export function getDeepseekClient(): OpenAI {
  if (!_deepseek) {
    _deepseek = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY ?? 'placeholder',
      baseURL: 'https://api.deepseek.com',
    });
  }
  return _deepseek;
}

export const DEEPSEEK_MODEL = 'deepseek-chat';
