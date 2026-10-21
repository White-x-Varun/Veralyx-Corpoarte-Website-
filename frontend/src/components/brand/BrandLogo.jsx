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
        src="/veralyx-logo.svg"
        alt=""
        aria-hidden="true"
        className="h-auto"
        style={{ width: compact ? '150px' : 'clamp(170px, 14vw, 200px)' }}
        width="500"
        height="190"
      />
    </Link>
  );
}
