import { useEffect } from 'react';
import { useSplitFlapStore } from '../store/useSplitFlapStore';

export function useSystemPreferences() {
  const setReducedMotion = useSplitFlapStore((state) => state.setReducedMotion);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);

    const listener = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, [setReducedMotion]);
}
