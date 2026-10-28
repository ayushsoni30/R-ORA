import React from 'react';

export const Logo = ({ size = 'md', showText = true, showTagline = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const svgSizes = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-xl font-bold',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Refined architectural key/doorway emblem */}
      <div
        className={`${iconSizes[size] || iconSizes.md} rounded-md bg-forest-800 flex items-center justify-center text-white shrink-0 shadow-subtle relative border border-forest-900/30`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={svgSizes[size] || svgSizes.md}
        >
          <path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-9Z" />
          <path d="M9 21V12h6v9" strokeWidth="2" />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size] || textSizes.md} text-charcoal font-extrabold tracking-tight leading-none`}>
            ROOMORA
          </span>
          {showTagline && (
            <span className="text-[10px] text-charcoal-muted font-medium tracking-tight mt-0.5">
              Student Accommodation
            </span>
          )}
        </div>
      )}
    </div>
  );
};
