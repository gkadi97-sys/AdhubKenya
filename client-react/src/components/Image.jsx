import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function Image({ 
  src, 
  alt = '', 
  className = '', 
  fallbackIconSize = 24,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-secondary flex items-center justify-center ${className}`}>
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && src && (
        <div className="absolute inset-0 bg-secondary animate-pulse" />
      )}

      {/* Error / Fallback State */}
      {(hasError || !src) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary text-muted-foreground z-10">
          <ImageIcon size={fallbackIconSize} className="opacity-50" />
        </div>
      )}

      {/* Actual Image */}
      {!hasError && src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          {...props}
        />
      )}
    </div>
  );
}
