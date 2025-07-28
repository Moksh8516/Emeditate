// components/Loader.tsx
import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'purple';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };
  
  const colorClasses = {
    primary: 'border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent',
    white: 'border-t-white border-r-white border-b-transparent border-l-transparent',
    purple: 'border-t-purple-600 border-r-purple-600 border-b-transparent border-l-transparent',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`rounded-full animate-spin ${
          sizeClasses[size]
        } ${
          colorClasses[color]
        }`}
      />
    </div>
  );
};

export {Loader};