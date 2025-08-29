import { useEffect } from 'react';

// Declare gtag type for Google Analytics
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

interface WebVitalsData {
  name: string;
  value: number;
  delta: number;
  id: string;
}

export const WebVitalsTracker = () => {
  useEffect(() => {
    const trackWebVitals = async () => {
      try {
        // Dynamic import with correct destructuring
        const webVitals = await import('web-vitals');
        
        const sendToAnalytics = (metric: WebVitalsData) => {
          // Track Core Web Vitals
          console.log(`${metric.name}: ${metric.value}`);
          
          // Send to Google Analytics 4 if available
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', metric.name, {
              value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
              event_category: 'Web Vitals',
              event_label: metric.id,
              non_interaction: true,
            });
          }
        };

        // Use the correct function names from web-vitals v4+
        if (webVitals.onCLS) webVitals.onCLS(sendToAnalytics);
        if (webVitals.onFCP) webVitals.onFCP(sendToAnalytics);  
        if (webVitals.onINP) webVitals.onINP(sendToAnalytics); // INP replaces FID in v4+
        if (webVitals.onLCP) webVitals.onLCP(sendToAnalytics);
        if (webVitals.onTTFB) webVitals.onTTFB(sendToAnalytics);
        
        // Track page load performance
        const trackPageLoad = () => {
          if (typeof window !== 'undefined' && 'performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (navigation) {
              const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
              const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
              
              console.log('Page Load Time:', pageLoadTime);
              console.log('DOM Content Loaded:', domContentLoaded);
              
              // Track as custom events
              if (window.gtag) {
                window.gtag('event', 'page_load_timing', {
                  event_category: 'Performance',
                  value: Math.round(pageLoadTime),
                  custom_parameter_1: Math.round(domContentLoaded)
                });
              }
            }
          }
        };

        if (document.readyState === 'complete') {
          trackPageLoad();
        } else {
          window.addEventListener('load', trackPageLoad, { once: true });
        }
        
      } catch (error) {
        console.log('Web Vitals tracking not available:', error);
      }
    };

    trackWebVitals();
  }, []);

  return null;
};

// Preload critical resources
export const preloadCriticalResources = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Preload critical images
    const criticalImages = [
      '/og-image.jpg',
      '/placeholder-construction-1.jpg',
      '/placeholder-renovation-1.jpg',
      '/placeholder-exterior-1.jpg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload critical CSS
    const criticalCSS = [
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'
    ];

    criticalCSS.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });

    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectDomains.forEach(domain => {
      const existingLink = document.querySelector(`link[href="${domain}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        if (domain.includes('gstatic')) {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      }
    });
  }, []);
};