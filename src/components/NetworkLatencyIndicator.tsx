import React from 'react';
import { Activity } from 'lucide-react';

export interface NetworkLatencyIndicatorProps {
  pingMs?: number | null;
  networkName?: string;
  className?: string;
}

export const NetworkLatencyIndicator: React.FC<NetworkLatencyIndicatorProps> = ({
  pingMs = null,
  networkName = 'Testnet',
  className = '',
}) => {
  let statusColor = 'bg-slate-500';
  let textColor = 'text-slate-400';
  let label = 'Probing...';

  if (typeof pingMs === 'number') {
    if (pingMs < 150) {
      statusColor = 'bg-emerald-500';
      textColor = 'text-emerald-400';
      label = `${pingMs}ms`;
    } else if (pingMs < 400) {
      statusColor = 'bg-amber-500';
      textColor = 'text-amber-400';
      label = `${pingMs}ms`;
    } else {
      statusColor = 'bg-rose-500';
      textColor = 'text-rose-400';
      label = `${pingMs}ms (High)`;
    }
  }

  return (
    <div
      role="status"
      aria-label={`Stellar ${networkName} latency: ${label}`}
      className={`inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs backdrop-blur-sm ${className}`}
    >
      <Activity className="h-3.5 w-3.5 text-slate-400" />
      <span className="font-medium text-slate-300">{networkName}</span>
      <span className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${statusColor} animate-pulse`} />
        <span className={`font-mono text-[11px] ${textColor}`}>{label}</span>
      </span>
    </div>
  );
};
