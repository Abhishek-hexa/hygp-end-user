import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Returns a ref to attach to a DOM element and a boolean indicating
 * whether that element is (or has been) visible in the viewport.
 * Once the element becomes visible, the observer disconnects and
 * `isVisible` stays `true` permanently.
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
) {
  const { root = null, rootMargin = '200px', threshold = 0 } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [root, rootMargin, threshold]);

  return { ref, isVisible };
}
