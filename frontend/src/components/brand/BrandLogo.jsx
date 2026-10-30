import { Link } from 'react-router-dom';
import { BRAND } from '@/content/brand';
import { cn } from '@/utils/cn';

export default function BrandLogo({ compact = false, className }) {
  return (
    <Link
      to="/"
      className={cn('inline-flex shrink-0 items-center', className)}
      aria-label={`${BRAND.name} — Authentic Strategies, Brilliant Outcomes`}
    >
      <img
        src="/brand/veralyx-header.png"
        alt=""
        aria-hidden="true"
        className="h-auto brightness-0 invert"
        style={{ width: compact ? '120px' : 'clamp(125px, 12vw, 140px)' }}
        width="840"
        height="460"
      />
    </Link>
  );
}
