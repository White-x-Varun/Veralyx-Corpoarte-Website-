import { motion } from 'framer-motion';
import { useMotionProps } from '@/hooks/useMotionProps';
import Badge from '@/components/ui/Badge';

export default function PageHero({ eyebrow, pretitle, title, subtitle, children, align = 'left' }) {
  const motionProps = useMotionProps();
  const centered = align === 'center';

  return (
    <section className={`page-hero relative overflow-hidden bg-hero-gradient${centered ? ' page-hero--centered' : ''}`}>
      <div className="pointer-events-none absolute inset-0 horizon-glow" aria-hidden="true" />
      <div className="container-app relative py-16 md:py-24">
        <div className="page-hero__layout">
          <motion.div {...motionProps} className="page-hero__copy">
            {eyebrow && (
              <Badge variant="brand" className="page-hero__eyebrow mb-6 rounded-full px-4 py-1.5">
                {eyebrow}
              </Badge>
            )}
            {pretitle && <div className="page-hero__pretitle">{pretitle}</div>}
            <h1 className="page-hero__title font-display font-semibold tracking-tight text-white">
              {title}
            </h1>
            {subtitle && <p className="page-hero__subtitle mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">{subtitle}</p>}
            {children}
          </motion.div>

          <div className="page-hero__visual" aria-hidden="true">
            <div className="page-hero__visual-grid" />
            <div className="page-hero__orbit page-hero__orbit--outer" />
            <div className="page-hero__orbit page-hero__orbit--inner" />
            <div className="page-hero__monogram">V</div>
            <span className="page-hero__visual-label page-hero__visual-label--top">Strategy / Demand / Growth</span>
            <span className="page-hero__visual-label page-hero__visual-label--bottom">Authentic strategies. Brilliant outcomes.</span>
            <span className="page-hero__spark page-hero__spark--one" />
            <span className="page-hero__spark page-hero__spark--two" />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-light/20 to-transparent" aria-hidden="true" />
    </section>
  );
}
