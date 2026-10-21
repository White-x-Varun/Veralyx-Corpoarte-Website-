import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Select = forwardRef(function Select(
  { className, label, error, id, hint, required, children, ...props },
  ref,
) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-200">
          {label}
          {required && <span className="ml-1 text-red-400" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={cn(
          'field-control flex h-10 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-white',
          'transition-colors appearance-none cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-navy',
          error ? 'border-red-500' : 'border-surface-border hover:border-slate-600',
          className,
        )}
        required={required}
        {...props}
      >
        {children}
      </select>
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;
