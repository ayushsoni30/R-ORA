import React from 'react';
import { Home } from 'lucide-react';

export const Logo = ({ size = 'md', showText = true, showTagline = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const svgSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-xl font-bold',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none tracking-tight text-navy ${className}`}>
      <span
        className={`${iconSizes[size] || iconSizes.md} rounded-md bg-navy-800 flex items-center justify-center text-white shadow-subtle shrink-0 relative`}
      >
        <Home className={svgSizes[size] || svgSizes.md} />
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white" />
      </span>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size] || textSizes.md} text-navy-800 font-bold tracking-tight leading-none`}>
            ROOMORA
          </span>
          {showTagline && (
            <span className="hidden sm:inline-block text-[10px] text-charcoal-muted font-medium tracking-tight mt-0.5">
              Rooms for Students
            </span>
          )}
        </div>
      )}
    </div>
  );
};
