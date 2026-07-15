// eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
import React from 'react';

export default function Skeleton({ className = '', variant = 'text', ...props }) {
  const baseClass = 'skeleton animate-pulse rounded-md bg-secondary/50';
  
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-[200px] w-full rounded-2xl',
    button: 'h-10 w-full rounded-xl',
  };

  return (
    <div 
      className={`${baseClass} ${variants[variant] || variants.text} ${className}`}
      {...props}
    />
  );
}
