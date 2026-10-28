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
    primary: 'bg-forest-800 hover:bg-forest-900 text-white shadow-subtle active:bg-forest-950',
    secondary: 'bg-sage hover:bg-sage-200 text-forest-800 font-semibold shadow-subtle border border-sage-300/60',
    accent: 'bg-amber-400 hover:bg-amber-500 text-charcoal font-semibold shadow-subtle',
    outline: 'border border-warm-border bg-white text-charcoal hover:bg-warm-hover hover:border-charcoal-muted shadow-subtle',
    danger: 'bg-rose-700 hover:bg-rose-800 text-white shadow-subtle',
    'danger-outline': 'border border-rose-300 text-rose-800 hover:bg-rose-50',
    ghost: 'text-charcoal-muted hover:text-charcoal hover:bg-warm-hover',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-4 py-2 gap-2 font-medium',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold',
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
