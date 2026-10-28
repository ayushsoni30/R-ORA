import React from 'react';
import { User } from 'lucide-react';

export const Avatar = ({
  src,
  name = '',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const getInitials = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Profile photo'}
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover border border-warm-border shadow-subtle shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} rounded-full bg-sage text-forest-800 font-bold flex items-center justify-center border border-sage-300/80 select-none shrink-0 ${className}`}
      title={name}
    >
      {initials ? initials : <User className="w-1/2 h-1/2 text-forest-800" />}
    </div>
  );
};
