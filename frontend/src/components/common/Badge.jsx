import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variants = {
    available: 'bg-[#E6F7F2] text-[#0D9876] border-[#0D9876]/30 font-semibold',
    occupied: 'bg-[#F0F2FA] text-[#6675A8] border-[#6675A8]/30 font-semibold',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-[#E6F7F2] text-[#0D9876] border-[#0D9876]/30 font-semibold',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    cancelled: 'bg-slate-100 text-charcoal-muted border-surface-border',
    student: 'bg-navy-50 text-navy-800 border-navy-200',
    owner: 'bg-teal-50 text-teal-800 border-teal-200',
    neutral: 'bg-slate-50 text-charcoal border-surface-border',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wide font-medium rounded',
    md: 'text-xs px-2.5 py-0.5 font-medium rounded',
    lg: 'text-sm px-3 py-1 font-medium rounded-md',
  };

  return (
    <span
      className={`inline-flex items-center border select-none ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};
