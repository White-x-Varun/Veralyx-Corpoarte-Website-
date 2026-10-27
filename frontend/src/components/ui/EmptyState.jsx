import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No items found',
  description,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-border px-6 py-16 text-center',
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-surface-elevated p-4">
        <Icon className="h-8 w-8 text-muted" aria-hidden="true" />
      </div>
      <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
