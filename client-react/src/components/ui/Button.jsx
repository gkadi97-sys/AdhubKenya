// eslint-disable-next-line no-unused-vars -- Kept for structural/API compatibility
import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  href,
  onClick,
  type = 'button',
  disabled,
  fullWidth = false,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active-scale disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-background hover:bg-secondary text-foreground',
    ghost: 'hover:bg-secondary/80 text-foreground',
    destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:opacity-90',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs rounded-lg',
    md: 'h-11 px-6 text-sm rounded-xl',
    lg: 'h-14 px-8 text-base rounded-2xl',
    icon: 'h-11 w-11 rounded-xl',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const content = (
    <>
      {loading && (
        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
}
