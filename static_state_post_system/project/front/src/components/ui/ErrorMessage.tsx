'use client';

import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  showRetry = false 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-red-500 text-2xl mb-2">⚠️</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        出现错误
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {message}
      </p>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          重试
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;