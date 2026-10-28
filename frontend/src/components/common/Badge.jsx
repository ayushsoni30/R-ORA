import React from 'react';
import { Check, Lock, Clock, X, User, Building } from 'lucide-react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  showDot = false,
  className = '',
}) => {
  const variants = {
    available: 'bg-sage text-forest-800 border-forest-800/20 font-semibold',
    occupied: 'bg-[#ECEEEA] text-charcoal-muted border-[#D5D8D3] font-semibold',
    pending: 'bg-amber-50 text-amber-900 border-amber-300 font-medium',
    accepted: 'bg-sage text-forest-800 border-forest-800/20 font-semibold',
    rejected: 'bg-rose-50 text-rose-800 border-rose-200 font-medium',
    cancelled: 'bg-warm-muted text-charcoal-muted border-warm-border',
    student: 'bg-sage-100 text-forest-800 border-sage-300 font-medium',
    owner: 'bg-warm-muted text-charcoal border-warm-border font-medium',
    neutral: 'bg-white text-charcoal border-warm-border font-medium',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 tracking-tight rounded',
    md: 'text-xs px-2.5 py-0.5 tracking-tight rounded',
    lg: 'text-sm px-3 py-1 tracking-tight rounded-md',
  };

  const getStatusIcon = (v) => {
    switch (v) {
      case 'available':
        return <span className="w-1.5 h-1.5 rounded-full bg-forest-800 shrink-0 mr-1.5" aria-hidden="true" />;
      case 'occupied':
        return <span className="w-1.5 h-1.5 rounded-full bg-charcoal-muted shrink-0 mr-1.5" aria-hidden="true" />;
      case 'pending':
        return <Clock className="w-3 h-3 text-amber-700 shrink-0 mr-1" aria-hidden="true" />;
      case 'accepted':
        return <Check className="w-3 h-3 text-forest-800 shrink-0 mr-1" aria-hidden="true" />;
      case 'rejected':
        return <X className="w-3 h-3 text-rose-700 shrink-0 mr-1" aria-hidden="true" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center border select-none leading-tight ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
    >
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 mr-1.5" />}
      {!showDot && getStatusIcon(variant)}
      <span>{children}</span>
    </span>
  );
};
