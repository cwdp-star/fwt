import { useEffect } from 'react';

export const AdvancedSEOMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const monitorWebVitals = () => {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID) - will be measured when user interacts
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const firstInputEntry = entry as any; // Cast to any for processingStart property
          console.log('FID:', firstInputEntry.processingStart - firstInputEntry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    };

    // SEO Health Check
    const seoHealthCheck = () => {
      const issues: string[] = [];

      // Check for missing meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription || !metaDescription.getAttribute('content')) {
        issues.push('Missing meta description');
      }

      // Check for missing title
      if (!document.title || document.title.length < 10) {
        issues.push('Title too short or missing');
      }

      // Check for images without alt text
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
      if (imagesWithoutAlt.length > 0) {
        issues.push(`${imagesWithoutAlt.length} images missing alt text`);
      }

      // Check for broken internal links
      const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="#"]');
      internalLinks.forEach((link) => {
        const href = (link as HTMLAnchorElement).href;
        if (!href || href === window.location.href + '#') {
          issues.push('Broken or empty internal link found');
        }
      });

      // Check for missing structured data
      const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
      if (structuredData.length === 0) {
        issues.push('No structured data found');
      }

      // Log SEO issues for monitoring
      if (issues.length > 0) {
        console.warn('SEO Issues Found:', issues);
      } else {
        console.log('✅ SEO Health Check Passed');
      }

      return issues;
    };

    // Monitor page performance metrics
    const monitorPageMetrics = () => {
      if ('performance' in window) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const paint = performance.getEntriesByType('paint');
            
            const metrics = {
              // Navigation timing
              dns: navigation.domainLookupEnd - navigation.domainLookupStart,
              tcp: navigation.connectEnd - navigation.connectStart,
              ttfb: navigation.responseStart - navigation.requestStart,
              downloadTime: navigation.responseEnd - navigation.responseStart,
              domProcessing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
              
              // Paint timing
              fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
              
              // Resource counts
              totalResources: performance.getEntriesByType('resource').length,
              imageResources: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'img').length
            };

            console.log('📊 Performance Metrics:', metrics);

            // Check for performance issues
            const warnings: string[] = [];
            if (metrics.ttfb > 600) warnings.push('TTFB too high (>600ms)');
            if (metrics.fcp > 1800) warnings.push('FCP too slow (>1.8s)');
            if (metrics.totalResources > 100) warnings.push('Too many resources loaded');
            if (metrics.imageResources > 20) warnings.push('Too many images');

            if (warnings.length > 0) {
              console.warn('⚠️ Performance Warnings:', warnings);
            }
          }, 1000);
        });
      }
    };

    // Initialize monitoring
    if (typeof window !== 'undefined') {
      monitorWebVitals();
      setTimeout(() => {
        seoHealthCheck();
        monitorPageMetrics();
      }, 2000);
    }
  }, []);

  return null;
};