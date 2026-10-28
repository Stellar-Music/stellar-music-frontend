import React from 'react';

export interface TrackSkeletonProps {
  count?: number;
}

export const TrackSkeleton: React.FC<TrackSkeletonProps> = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          {/* Square Artwork Skeleton */}
          <div
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
                animation: 'shimmer 1.8s infinite',
              }}
            />
          </div>

          {/* Track Info Skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                height: '18px',
                width: '75%',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
              }}
            />
            <div
              style={{
                height: '14px',
                width: '45%',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              }}
            />
          </div>

          {/* Footer Skeleton */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                height: '14px',
                width: '50px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              }}
            />
            <div
              style={{
                height: '24px',
                width: '80px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
};
