import { useChat } from '@tanstack/ai-react';
import { fetchServerSentEvents } from '@tanstack/ai-react';
import { llmEmitter, type ChatMessage, type AIActionOptions } from './llm-emitter';

export { type ChatMessage, type AIActionOptions } from './llm-emitter';

export interface UseAIChatOptions {
  projectContext?: AIActionOptions['projectContext'];
  initialMessages?: ChatMessage[];
  onFinish?: (message: { role: string; content: string }) => void;
  onError?: (error: Error) => void;
  onResponse?: (response: Response) => void;
  onChunk?: (chunk: any) => void;
}

/**
 * Hook for using AI chat in client components
 * Uses TanStack AI's useChat with server action connection
 *
 * Note: This requires an API route at /api/ai/chat that calls llmEmitter
 */
export function useAIChat(options?: UseAIChatOptions) {
  const { initialMessages, onFinish, onError, onResponse, onChunk } = options ?? {};

  return useChat({
    connection: fetchServerSentEvents('/api/ai/chat', {
      headers: options?.projectContext ? {
        'x-project-context': JSON.stringify(options.projectContext),
      } : {},
    }),
    initialMessages: initialMessages as any[],
    onFinish: onFinish as any,
    onError: onError as any,
    onResponse: onResponse as any,
    onChunk: onChunk as any,
  });
}

/**
 * Alternative hook that fetches from a custom URL
 */
export function useAIChatFromAPI(url: string = '/api/chat', headers?: Record<string, string>) {
  return useChat({
    connection: fetchServerSentEvents(url, { headers }),
  });
}