import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';
import BrandLogo from '@/components/brand/BrandLogo';
import SpectrumBar from '@/components/brand/SpectrumBar';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Work' },
  { to: '/careers', label: 'Careers' },
  { to: '/blog', label: 'Insights' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  const linkClass = ({ isActive }) =>
    cn(
      'relative py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-gradient-to-r after:from-brand-light after:to-amber-200 after:transition-transform',
      isActive ? 'text-white after:scale-x-100' : 'text-slate-400 hover:text-white',
    );

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0e0f10]/85 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <SpectrumBar />
      <nav className="container-app flex h-[4.75rem] items-center justify-between" aria-label="Main navigation">
        <BrandLogo />

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-brand to-[#c65c35] px-5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:from-brand-light hover:to-amber-200 hover:text-[#25150e]"
          >
            Work with us
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="overflow-hidden border-t border-surface-border lg:hidden"
          >
            <ul className="container-app space-y-1 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-lg px-3 py-2.5 text-base font-medium',
                        isActive ? 'bg-brand/10 text-white' : 'text-slate-300 hover:bg-white/5',
                      )
                    }
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/contact"
                  className="block rounded-lg bg-brand px-3 py-2.5 text-center text-sm font-medium text-white"
                  onClick={() => setOpen(false)}
                >
                  Work with us
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
