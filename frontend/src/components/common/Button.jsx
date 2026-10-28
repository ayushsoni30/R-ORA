import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon,
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md';

  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-subtle disabled:hover:bg-teal-600 active:bg-teal-800',
    secondary: 'bg-navy-800 hover:bg-navy-900 text-white shadow-subtle disabled:hover:bg-navy-800 active:bg-navy-900',
    outline: 'border border-surface-border bg-white text-charcoal hover:bg-surface-hover hover:border-slate-300 shadow-subtle',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-subtle disabled:hover:bg-rose-600',
    'danger-outline': 'border border-rose-300 text-rose-700 hover:bg-rose-50',
    ghost: 'text-charcoal-muted hover:text-navy hover:bg-surface-hover',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-4 py-2 gap-2 font-medium',
    lg: 'text-base px-6 py-2.5 gap-2.5 font-medium',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};
