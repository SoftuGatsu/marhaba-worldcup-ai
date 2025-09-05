import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ onRetry }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="chat-card bg-gradient-to-r from-red-50 to-red-50/50 border-red-200/50">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-red-800 mb-1">
              Connection Error
            </h4>
            <p className="text-red-700 text-sm mb-3">
              Sorry, I'm having trouble connecting right now. This might be a temporary issue.
            </p>
            
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center space-x-2 text-red-600 hover:text-red-800 font-medium text-sm transition-colors group"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};