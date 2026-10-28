import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || props.name;
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
          {label}
          {required && <span className="text-rose-600 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full px-3 py-2 text-sm bg-white border rounded-md transition-colors placeholder:text-charcoal-muted/50 text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-forest-800 disabled:bg-warm-muted disabled:text-charcoal-muted disabled:cursor-not-allowed ${
            isPassword ? 'pr-10' : ''
          } ${
            error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-warm-border'
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 p-1 text-charcoal-muted hover:text-charcoal focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-rose-600 mt-1 font-medium">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-charcoal-muted mt-1 leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
