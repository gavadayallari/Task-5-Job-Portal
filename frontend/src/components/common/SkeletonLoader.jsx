import React from 'react';

export const JobCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
          </div>
        </div>
        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
        <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 rounded-full" />
        <div className="h-6 w-28 bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
};

export const DashboardCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      </div>
      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-3 w-40 bg-slate-100 dark:bg-slate-800/60 rounded" />
    </div>
  );
};

export default { JobCardSkeleton, DashboardCardSkeleton };
