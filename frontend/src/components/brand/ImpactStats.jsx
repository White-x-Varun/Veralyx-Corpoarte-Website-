import { useEffect, useRef, useState } from 'react';
import { FOUNDER_STATS } from '@/content/brand';
import { cn } from '@/utils/cn';

function useCountUp(target, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) { setCount(target); return undefined; }
    let frame;
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return count;
}

function StatValue({ stat, active }) {
  const count = useCountUp(stat.target, active);
  const shown = stat.compact && count >= 1000
    ? `${(count / 1000).toLocaleString('en-IN', { maximumFractionDigits: 0 })}K`
    : count.toLocaleString('en-IN');
  return <>{stat.prefix || ''}{shown}{stat.suffix || ''}</>;
}

export default function ImpactStats({ className }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') { setActive(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6', className)}>
        {FOUNDER_STATS.map((stat) => (
          <div
            key={stat.label}
            className="impact-stat rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-5 text-left transition duration-300 hover:border-brand/30 hover:bg-brand/[0.05] sm:px-5"
          >
            <p className="font-display text-2xl font-semibold tracking-tight text-white sm:text-[1.7rem]" aria-label={stat.value}><StatValue stat={stat} active={active} /></p>
            <p className="mt-2 text-[11px] font-medium leading-snug text-muted sm:text-xs">{stat.label}</p>
          </div>
        ))}
    </div>
  );
}
