'use server';

import { chat } from '@tanstack/ai';
import { openaiText } from '@tanstack/ai-openai';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIActionOptions {
  projectContext?: {
    projectId?: string;
    projectName?: string;
    projectType?: string;
  };
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for a real estate construction estimation application.
You help users with:
- Project cost estimation and analysis
- ROI calculations and financial projections
- Material takeoff and quantity calculations
- Construction phase planning
- General real estate development questions

Be concise, professional, and provide actionable insights. Format your responses clearly with bullet points or numbered lists when appropriate.
If asked about specific calculations, show your work and explain the methodology.`;

/**
 * Server action that streams chat responses using TanStack AI
 * Returns an AsyncIterable stream for use with the stream connection adapter
 */
export async function llmEmitter(
  messages: ChatMessage[],
  options?: AIActionOptions
): Promise<AsyncIterable<any>> {
  const contextPrompt = options?.projectContext?.projectName
    ? `\n\nContext: You are currently helping with project "${options.projectContext.projectName}" (${options.projectContext.projectType || 'real estate'}).`
    : '';

  const systemMessages: ChatMessage[] = [
    { role: 'system', content: `${SYSTEM_PROMPT}${contextPrompt}` },
    ...messages,
  ];

  return chat({
    adapter: openaiText('gpt-4o-mini'),
    messages: systemMessages as any[],
  });
}

/**
 * Non-streaming version that returns the full text response
 */
export async function llmEmitterText(
  messages: ChatMessage[],
  options?: AIActionOptions
): Promise<string> {
  const contextPrompt = options?.projectContext?.projectName
    ? `\n\nContext: You are currently helping with project "${options.projectContext.projectName}" (${options.projectContext.projectType || 'real estate'}).`
    : '';

  const systemMessages: ChatMessage[] = [
    { role: 'system', content: `${SYSTEM_PROMPT}${contextPrompt}` },
    ...messages,
  ];

  const stream = chat({
    adapter: openaiText('gpt-4o-mini'),
    messages: systemMessages as any[],
    stream: false,
  });

  let text = '';
  for await (const chunk of stream) {
    if (chunk.type === 'content') {
      text += chunk.delta;
    }
  }
  return text;
}