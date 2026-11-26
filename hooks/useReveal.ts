import { useEffect } from 'react';

interface UseRevealOptions {
  heroSelector?: string;
  baseDelay?: number;
  stepDelay?: number;
}

export function useReveal({
  heroSelector,
  baseDelay = 100,
  stepDelay = 120,
}: UseRevealOptions = {}) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const reveals = document.querySelectorAll<HTMLElement>('.reveal');

    if (prefersReducedMotion) {
      reveals.forEach((el) => {
        el.classList.add('visible');
        el.querySelectorAll<HTMLElement>('.context-stat-bar-fill').forEach((bar) => {
          bar.classList.add('animated');
        });
      });
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
            e.target
              .querySelectorAll<HTMLElement>('.context-stat-bar-fill')
              .forEach((bar) => {
                setTimeout(() => bar.classList.add('animated'), 200);
              });
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => obs.observe(el));

    if (heroSelector) {
      document
        .querySelectorAll<HTMLElement>(`${heroSelector} .reveal`)
        .forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), baseDelay + i * stepDelay);
        });
    }

    return () => obs.disconnect();
  }, [baseDelay, heroSelector, stepDelay]);
}
