import React from 'react';
import { formatBasisPoints } from '../utils/formatters';

export interface RoyaltyContributorShare {
  display_name: string;
  role: string;
  percentage: number;
  color?: string;
  wallet_address?: string;
}

export interface RoyaltyBarProps {
  contributors: RoyaltyContributorShare[];
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export const ROLE_COLOR_MAP: Record<string, string> = {
  Artist: '#00f2fe',
  Producer: '#7928ca',
  Songwriter: '#10b981',
  Composer: '#3b82f6',
  Engineer: '#f59e0b',
  Vocalist: '#ec4899',
  Curator: '#06b6d4',
};

const DEFAULT_PALETTE = ['#00f2fe', '#7928ca', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#06b6d4'];

export const RoyaltyBar: React.FC<RoyaltyBarProps> = ({
  contributors,
  height = 14,
  showLegend = true,
  className = '',
}) => {
  const getContributorColor = (c: RoyaltyContributorShare, index: number): string => {
    if (c.color) return c.color;
    if (c.role && ROLE_COLOR_MAP[c.role]) return ROLE_COLOR_MAP[c.role];
    return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
  };

  const totalPercentage = contributors.reduce(
    (sum, c) => sum + (parseFloat(c.percentage.toString()) || 0),
    0
  );

  return (
    <div className={`royalty-bar-container ${className}`} style={{ width: '100%' }}>
      {/* Visual Multi-Segment Bar */}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          borderRadius: `${Math.round(height / 2)}px`,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
        }}
      >
        {contributors.map((c, idx) => {
          const pct = parseFloat(c.percentage.toString()) || 0;
          if (pct <= 0) return null;
          const color = getContributorColor(c, idx);
          const bps = Math.round(pct * 100);

          return (
            <div
              key={idx}
              title={`${c.display_name} (${c.role}): ${pct}% • ${formatBasisPoints(bps)}`}
              style={{
                width: `${Math.min(100, (pct / Math.max(100, totalPercentage)) * 100)}%`,
                height: '100%',
                backgroundColor: color,
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
            />
          );
        })}
      </div>

      {/* Legend */}
      {showLegend && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 16px',
            marginTop: '10px',
            fontSize: '0.76rem',
          }}
        >
          {contributors.map((c, idx) => {
            const pct = parseFloat(c.percentage.toString()) || 0;
            const color = getContributorColor(c, idx);

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--text-secondary)',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {c.display_name || `Contributor #${idx + 1}`}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    color: color,
                    fontWeight: 600,
                  }}
                >
                  {c.role}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
