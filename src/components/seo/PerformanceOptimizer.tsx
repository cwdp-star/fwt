import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Implement lazy loading for images
    const implementLazyLoading = () => {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    };

    // Optimize third-party scripts
    const optimizeThirdPartyScripts = () => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[src]:not([async]):not([defer])');
      scripts.forEach(script => {
        const scriptElement = script as HTMLScriptElement;
        if (!scriptElement.src.includes('critical') && !scriptElement.src.includes('main')) {
          scriptElement.setAttribute('defer', '');
        }
      });
    };

    // Preload next likely pages
    const preloadLikelyPages = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        const links = nav.querySelectorAll('a[href^="/"]');
        links.forEach((link, index) => {
          if (index < 3) { // Preload first 3 navigation links
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = (link as HTMLAnchorElement).href;
            document.head.appendChild(prefetchLink);
          }
        });
      }
    };

    // Optimize CSS delivery
    const optimizeCSSDelivery = () => {
      // Move non-critical CSS to load after page load
      window.addEventListener('load', () => {
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][media="print"]');
        nonCriticalCSS.forEach(link => {
          link.setAttribute('media', 'all');
        });
      });
    };

    // Performance monitoring
    const monitorPerformance = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const paint = performance.getEntriesByType('paint');
            
            if (navigation) {
              const metrics = {
                TTFB: navigation.responseStart - navigation.fetchStart,
                FCP: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                LCP: 0, // Will be measured by Web Vitals
                CLS: 0  // Will be measured by Web Vitals
              };
              
              // Log metrics for monitoring
              console.log('Performance Metrics:', metrics);
            }
          }, 1000);
        });
      }
    };

    // Initialize optimizations
    setTimeout(() => {
      implementLazyLoading();
      optimizeThirdPartyScripts();
      preloadLikelyPages();
      optimizeCSSDelivery();
      monitorPerformance();
    }, 100);
  }, []);

  return (
    <Helmet>
      {/* Critical resource hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Preload critical images */}
      <link rel="preload" href="/og-image.jpg" as="image" type="image/jpeg" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Prefetch likely navigation targets */}
      <link rel="prefetch" href="/projetos" />
      
      {/* Performance and security headers via meta tags */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Mobile performance optimizations */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Cache control hints */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
    </Helmet>
  );
};