'use client';

import { Suspense } from 'react';
import SidebarContent from './SidebarContent';

const SidebarWrapper = () => {
  return (
    <Suspense fallback={
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    }>
      <SidebarContent />
    </Suspense>
  );
};

export default SidebarWrapper;