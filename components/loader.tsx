// components/Loader.tsx
import React from 'react';

interface LoaderProps {
  size?:  'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'purple';
  className?: string;
  text?: React.ReactNode;
}

const Loader: React.FC<LoaderProps> = ({
  color = 'purple',
  size = 'lg',
  className = '',
  text = ""
}) => {
  const sizeClasses = {
    md: 'h-8 w-8 mb-2',
    lg: 'h-12 w-12 mb-4',
    xl: 'h-16 w-16 mb-6'
  };
  
  const colorClasses = {
    primary: 'rounded-full border-t-2 border-b-2 border-indigo-600',
    white: 'rounded-full border-t-2 border-b-2 border-white',
    purple: 'rounded-full border-t-2 border-b-2 border-purple-500',
  };


  return (
        <div className={`text-center ${className}`}>
          <div className={`inline-block animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}></div>
          <p className="text-gray-300">{text}</p>
        </div>
  );
};

export {Loader};