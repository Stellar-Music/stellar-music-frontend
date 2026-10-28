import React, { useState } from 'react';
import { Disc3, Music } from 'lucide-react';

export interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  iconSize?: number;
}

export const ImageFallback: React.FC<ImageFallbackProps> = ({
  src,
  alt,
  fallbackTitle,
  iconSize = 36,
  style,
  className = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`image-fallback ${className}`}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #121526 0%, #1e1b4b 50%, #0d1122 100%)',
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
        role="img"
        aria-label={alt || fallbackTitle || 'Audio artwork placeholder'}
      >
        {/* Subtle decorative concentric vinyl grooves */}
        <div
          style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '55%',
            height: '55%',
            borderRadius: '50%',
            border: '1px dashed rgba(0, 242, 254, 0.12)',
          }}
        />

        <Disc3 size={iconSize} color="var(--accent-cyan)" style={{ opacity: 0.75, animation: 'spin 20s linear infinite' }} />

        {fallbackTitle && (
          <span
            style={{
              marginTop: '6px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              maxWidth: '85%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      onLoad={() => setIsLoaded(true)}
      className={className}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0.4,
        transition: 'opacity 0.25s ease',
      }}
      {...rest}
    />
  );
};
