import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 border rounded-xl text-sm
              bg-white text-slate-900 placeholder-slate-400
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500
              disabled:bg-slate-50 disabled:cursor-not-allowed
              ${prefix ? 'pl-8' : ''}
              ${suffix ? 'pr-8' : ''}
              ${error
                ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                : 'border-slate-200 hover:border-slate-300'
              }
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-rose-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';