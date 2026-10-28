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
      className={`border border-dashed border-slate-300 rounded-lg p-8 sm:p-12 text-center bg-white/50 flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mb-3.5">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
