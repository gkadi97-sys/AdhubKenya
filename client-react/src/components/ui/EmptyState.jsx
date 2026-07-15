// eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  primaryAction, 
  secondaryAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-secondary/20 w-full ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
          <Icon className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
      )}
      
      <h3 className="text-xl font-display font-bold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-muted-foreground mb-8 max-w-sm text-sm leading-relaxed">
          {description}
        </p>
      )}
      
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-xs sm:max-w-none">
          {primaryAction && (
            <Link 
              to={primaryAction.href}
              onClick={primaryAction.onClick}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm hover:opacity-90 transition-opacity flex justify-center"
            >
              {primaryAction.label}
            </Link>
          )}
          
          {secondaryAction && (
            <Link 
              to={secondaryAction.href}
              onClick={secondaryAction.onClick}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-border bg-background font-semibold text-sm hover:bg-secondary transition-colors flex justify-center"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
