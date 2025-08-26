import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 24, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 
        size={size} 
        className="animate-spin text-white/70"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
      />
    </div>
  );
};