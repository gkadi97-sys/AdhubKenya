// eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
import React from 'react';
import { BadgeCheck, Zap, Sparkles } from 'lucide-react';

export default function Badge({ 
  children, 
  variant = 'default', 
  className = '',
  icon = null
}) {
  const baseClasses = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-colors';
  
  const variants = {
    default: 'bg-secondary text-secondary-foreground',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    verified: 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
    hot: 'bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800',
    featured: 'gradient-emerald text-primary-foreground shadow-sm',
    new: 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
    outline: 'border border-border text-muted-foreground',
  };

  const getIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'verified': return <BadgeCheck className="w-3 h-3" />;
      case 'hot': return <Zap className="w-3 h-3" fill="currentColor" />;
      case 'featured': return <Sparkles className="w-3 h-3" />;
      default: return null;
    }
  };

  const Icon = getIcon();

  return (
    <span className={`${baseClasses} ${variants[variant] || variants.default} ${className}`}>
      {Icon}
      {children}
    </span>
  );
}
