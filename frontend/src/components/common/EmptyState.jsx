import React from 'react';
import { Home } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Home,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  action,
  className = '',
}) => {
  return (
    <div
      className={`border border-warm-border rounded-lg p-8 sm:p-12 text-center bg-white shadow-subtle flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-lg bg-sage flex items-center justify-center text-forest-800 mb-3.5 border border-sage-300/40">
        <Icon className="w-6 h-6 stroke-[1.8]" />
      </div>
      <h3 className="text-base font-bold text-charcoal mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mb-5 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
