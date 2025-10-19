import { useEffect, useRef, useState } from 'react';

interface UseLazyAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  duration?: number;
}

export const useLazyAnimation = (options: UseLazyAnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    threshold = 0.15,
    rootMargin = '0px 0px -100px 0px',
    delay = 0,
    duration = 800,
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, delay, hasAnimated]);

  return {
    elementRef,
    isVisible,
    animationClass: isVisible ? 'animate-in' : 'animate-out',
    style: {
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  };
};

export const useStaggeredLazyAnimation = (
  itemCount: number,
  options: UseLazyAnimationOptions = {}
) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    delay = 100,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the animations
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems((prev) => new Set([...prev, i]));
            }, i * delay);
          }
          setHasAnimated(true);
          observer.unobserve(container);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(container);

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [itemCount, threshold, rootMargin, delay, hasAnimated]);

  return {
    containerRef,
    visibleItems,
    isItemVisible: (index: number) => visibleItems.has(index),
  };
};
