import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
};

export const RoomCardSkeleton = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-1/2 mb-3" />
          <Skeleton className="h-3 w-full mb-1.5" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
};
