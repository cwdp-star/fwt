// Performance optimization utilities

export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

export const preloadCriticalImages = (imageUrls: string[]) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

export const optimizeImageForWebP = (url: string): string => {
  // Check if browser supports WebP
  const canvas = document.createElement('canvas');
  const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  if (supportsWebP && url.includes('supabase')) {
    // Append WebP transformation parameter for Supabase
    return `${url}?format=webp&quality=85`;
  }
  
  return url;
};

export const measureWebVitals = () => {
  // Measure Core Web Vitals
  const measureCLS = () => {
    let clsValue = 0;
    let clsEntries: any[] = [];

    const cls = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsEntries.push(entry);
          clsValue += entry.value;
        }
      }
    });

    cls.observe({ type: 'layout-shift', buffered: true });
    
    return () => clsValue;
  };

  const measureLCP = () => {
    let lcpValue = 0;

    const lcp = new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[];
      const lastEntry = entries[entries.length - 1];
      lcpValue = lastEntry.startTime;
    });

    lcp.observe({ type: 'largest-contentful-paint', buffered: true });
    
    return () => lcpValue;
  };

  const measureFID = () => {
    let fidValue = 0;

    const fid = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        fidValue = entry.processingStart - entry.startTime;
      }
    });

    fid.observe({ type: 'first-input', buffered: true });
    
    return () => fidValue;
  };

  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    return {
      getCLS: measureCLS(),
      getLCP: measureLCP(),
      getFID: measureFID()
    };
  }

  return {
    getCLS: () => 0,
    getLCP: () => 0,
    getFID: () => 0
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};