import React from 'react';

export const Input = React.forwardRef(({
  label,
  id,
  type = 'text',
  error,
  helperText,
  required = false,
  className = '',
  ...props
}, ref) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className={`w-full px-3 py-2 text-sm bg-white border rounded-md transition-colors placeholder:text-charcoal-muted/60 text-charcoal focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 disabled:bg-slate-50 disabled:text-charcoal-muted disabled:cursor-not-allowed ${
          error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-surface-border'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-rose-600 mt-1 font-medium">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-charcoal-muted mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
