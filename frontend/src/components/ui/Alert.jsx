import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const variants = {
  info: {
    icon: Info,
    className: 'border-brand/30 bg-brand/10 text-slate-100',
  },
  success: {
    icon: CheckCircle,
    className: 'border-green-500/30 bg-green-500/10 text-green-100',
  },
  error: {
    icon: AlertCircle,
    className: 'border-red-500/30 bg-red-500/10 text-red-100',
  },
  warning: {
    icon: AlertCircle,
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
  },
};

export default function Alert({ variant = 'info', title, children, onDismiss, className }) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-lg border p-4', config.className, className)}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn('text-sm', title && 'mt-1 opacity-90')}>{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
