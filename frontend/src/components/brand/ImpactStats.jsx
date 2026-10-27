import { FOUNDER_STATS } from '@/content/brand';
import { cn } from '@/utils/cn';

export default function ImpactStats({ className }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6', className)}>
        {FOUNDER_STATS.map((stat) => (
          <div
            key={stat.label}
            className="impact-stat rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-5 text-left transition duration-300 hover:border-brand/30 hover:bg-brand/[0.05] sm:px-5"
          >
            <p className="font-display text-2xl font-semibold tracking-tight text-white sm:text-[1.7rem]">{stat.value}</p>
            <p className="mt-2 text-[11px] font-medium leading-snug text-muted sm:text-xs">{stat.label}</p>
          </div>
        ))}
    </div>
  );
}
