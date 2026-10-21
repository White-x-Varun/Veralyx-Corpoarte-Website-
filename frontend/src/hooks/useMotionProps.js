import { useReducedMotion } from './useReducedMotion';

export function useMotionProps(overrides = {}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return {
      initial: false,
      animate: overrides.animate ?? {},
      transition: { duration: 0 },
      ...overrides,
    };
  }

  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
    ...overrides,
  };
}
