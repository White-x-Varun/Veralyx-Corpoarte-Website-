import { CirclePlay, UsersRound } from 'lucide-react';

export default function VideoFeatureCard({ title, description, label, people = false }) {
  const Icon = people ? UsersRound : CirclePlay;

  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-elevated/45">
      <div className="video-slot relative grid aspect-video place-items-center overflow-hidden">
        <div className="video-slot__orb video-slot__orb--one" aria-hidden="true" />
        <div className="video-slot__orb video-slot__orb--two" aria-hidden="true" />
        <div className="video-slot__grid" aria-hidden="true" />
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-brand-light/30 bg-surface/70 text-brand-light shadow-glow">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
          <span className="rounded-full border border-white/10 bg-surface/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
            {label}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </article>
  );
}
