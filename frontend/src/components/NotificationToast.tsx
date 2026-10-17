import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function NotificationToast({ toasts, onDismiss }: NotificationToastProps) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bgClass = 'bg-emerald-600 text-white';
        if (toast.type === 'info') {
          Icon = Info;
          bgClass = 'bg-blue-600 text-white';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          bgClass = 'bg-amber-600 text-white';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          bgClass = 'bg-rose-600 text-white';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-lg flex items-center justify-between gap-3 text-xs font-medium animate-in slide-in-from-bottom-3 duration-200 ${bgClass}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span className="truncate leading-relaxed">{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 hover:bg-black/10 rounded-lg shrink-0 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
