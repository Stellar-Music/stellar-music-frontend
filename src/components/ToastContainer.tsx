import React, { useEffect, useState } from 'react';
import { toast, ToastItem } from '../services/toast';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsub = toast.subscribe((updated) => {
      setToasts(updated);
    });
    return unsub;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notification Center"
      className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      {toasts.map((t) => {
        let borderClass = 'border-slate-800 bg-slate-900/95 text-slate-200';
        let Icon = Info;
        let iconClass = 'text-cyan-400';

        if (t.type === 'success') {
          borderClass = 'border-emerald-500/30 bg-slate-900/95 text-emerald-100';
          Icon = CheckCircle2;
          iconClass = 'text-emerald-400';
        } else if (t.type === 'error') {
          borderClass = 'border-rose-500/30 bg-slate-900/95 text-rose-100';
          Icon = AlertCircle;
          iconClass = 'text-rose-400';
        } else if (t.type === 'warning') {
          borderClass = 'border-amber-500/30 bg-slate-900/95 text-amber-100';
          Icon = AlertTriangle;
          iconClass = 'text-amber-400';
        }

        return (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border p-3.5 shadow-2xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${borderClass}`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
            <p className="flex-1 text-xs font-medium leading-relaxed">{t.message}</p>
            <button
              onClick={() => toast.dismiss(t.id)}
              aria-label="Close notification"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
