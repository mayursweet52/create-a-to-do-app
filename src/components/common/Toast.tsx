import React from 'react';
import { useTodo } from '../../context/TodoContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTodo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
            case 'info':
            default:
              return <Info className="w-5 h-5 text-indigo-500 shrink-0" />;
          }
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/40 animate-slide-down transition-all"
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {toast.message}
                </p>
              )}
            </div>

            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick();
                  removeToast(toast.id);
                }}
                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 transition-colors shrink-0"
              >
                {toast.action.label}
              </button>
            )}

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
