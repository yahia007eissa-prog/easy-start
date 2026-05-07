'use client';

import { useRef, useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAIChat } from '@/lib/ai/actions';
import { Send, Bot, User, Sparkles, Trash2, Moon, Sun } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function ChatPage() {
  const t = useTranslations('chat');
  const locale = useLocale();
  const [isDark, setIsDark] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, isLoading, stop, reload, clear } = useAIChat({
    projectContext: {
      projectName: 'General',
      projectType: 'real estate',
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current?.value?.trim();
    if (!input || isLoading) return;

    if (inputRef.current) {
      inputRef.current.value = '';
    }
    await sendMessage(input as any);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Ambient background gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-amber-500/5' : 'bg-amber-400/10'}`} />
        <div className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-400/10'}`} />
      </div>

      {/* Header */}
      <header className={`relative border-b ${isDark ? 'border-slate-800/50' : 'border-slate-200/50'}`}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo mark */}
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl ${isDark ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-amber-400 to-amber-500'} flex items-center justify-center shadow-lg shadow-amber-500/20`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 dark:border-slate-950" />
            </div>
            <div>
              <h1 className={`text-xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('title')}
              </h1>
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {t('subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <button
                onClick={clear}
                className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
                title={t('clearChat')}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-32">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center pt-20 pb-12">
            <div className={`w-20 h-20 rounded-3xl ${isDark ? 'bg-slate-900/80 border border-slate-800' : 'bg-white border border-slate-200'} flex items-center justify-center mb-6 shadow-xl`}>
              <Bot className={`w-10 h-10 ${isDark ? 'text-amber-500' : 'text-amber-500'}`} />
            </div>
            <h2 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('howCanIHelp')}
            </h2>
            <p className={`text-center max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {t('chatPrompt')}
            </p>

            {/* Suggested prompts */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {[
                { key: 'roi', label: t('suggestions.roi') },
                { key: 'material', label: t('suggestions.material') },
                { key: 'cost', label: t('suggestions.cost') },
                { key: 'phase', label: t('suggestions.phase') },
              ].map((prompt) => (
                <button
                  key={prompt.key}
                  onClick={() => sendMessage(prompt.label)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isDark
                      ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/50 hover:border-amber-500/30'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-amber-300 shadow-sm'
                  }`}
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${
                  message.role === 'user'
                    ? isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-slate-600 to-slate-700'
                    : 'bg-gradient-to-br from-amber-500 to-amber-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message content */}
                <div className={`flex-1 min-w-0 ${message.role === 'user' ? '' : 'pr-4'}`}>
                  <div className={`inline-block px-5 py-4 rounded-2xl ${
                    message.role === 'user'
                      ? isDark
                        ? 'bg-slate-800/80 text-slate-200 rounded-tr-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tr-sm'
                      : isDark
                        ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-slate-100 rounded-tl-sm border border-slate-700/30'
                        : 'bg-white text-slate-800 rounded-tl-sm border border-slate-200 shadow-sm'
                  }`}>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap leading-relaxed">{String((message as any).content || '')}</p>
                    </div>
                  </div>

                  {/* Timestamp */}
                  {message.role === 'assistant' && (
                    <div className={`flex items-center gap-2 mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {isLoading && index === messages.length - 1 && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0">
        <div className="max-w-4xl mx-auto px-6 pb-6">
          <div className={`rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
            isDark
              ? 'bg-slate-900/80 border-slate-800/50 shadow-2xl shadow-black/20'
              : 'bg-white/90 border-slate-200/50 shadow-xl shadow-slate-200/50'
          }`}>
            <form onSubmit={handleSubmit} className="flex items-end gap-3 p-4">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  onKeyDown={handleKeyDown}
                  placeholder={t('inputPlaceholder')}
                  rows={1}
                  className={`w-full resize-none rounded-xl px-4 py-3 text-base transition-colors focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-slate-800/50 text-white placeholder-slate-500 focus:ring-amber-500/50 border border-slate-700/30'
                      : 'bg-slate-50 text-slate-900 placeholder-slate-400 focus:ring-amber-400/50 border border-slate-200'
                  }`}
                  style={{ maxHeight: '120px' }}
                />
              </div>
              <div className="flex items-center gap-2">
                {isLoading && messages.length > 0 ? (
                  <button
                    type="button"
                    onClick={stop}
                    className={`p-3 rounded-xl font-medium transition-all ${
                      isDark
                        ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30'
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-current rounded-sm" />
                      <span className="w-2 h-2 bg-current rounded-sm" />
                    </span>
                  </button>
                ) : messages.length > 0 ? (
                  <button
                    type="button"
                    onClick={reload}
                    className={`p-3 rounded-xl transition-all ${
                      isDark
                        ? 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                    }`}
                    title="Regenerate response"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 4v6h6M23 20v-6h-6" />
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                    </svg>
                  </button>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`p-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5'
                      : 'bg-gradient-to-br from-amber-400 to-amber-500 text-white hover:shadow-lg hover:shadow-amber-400/25 hover:-translate-y-0.5'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Footer hint */}
          <p className={`text-center text-xs mt-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            {t('aiDisclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}