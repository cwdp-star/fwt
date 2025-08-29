import { useEffect } from 'react';

export const SEOOptimizer = () => {
  useEffect(() => {
    // Optimize images with lazy loading and WebP support
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('data-src');
            
            if (src) {
              // Create WebP version if supported
              const supportsWebP = document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp');
              
              if (supportsWebP && src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png')) {
                const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                
                // Try WebP first, fallback to original
                const testImg = new Image();
                testImg.onload = () => {
                  img.src = webpSrc;
                  img.removeAttribute('data-src');
                };
                testImg.onerror = () => {
                  img.src = src;
                  img.removeAttribute('data-src');
                };
                testImg.src = webpSrc;
              } else {
                img.src = src;
                img.removeAttribute('data-src');
              }
              
              imageObserver.unobserve(img);
            }
          }
        });
      }, { rootMargin: '50px' });

      images.forEach(img => imageObserver.observe(img));
    };

    // Add missing alt texts automatically
    const addMissingAltTexts = () => {
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach((img) => {
        const src = img.getAttribute('src') || '';
        let altText = 'RC Construções';
        
        if (src.includes('construction')) {
          altText = 'Projeto de construção RC Construções - estruturas de betão armado';
        } else if (src.includes('renovation')) {
          altText = 'Remodelação RC Construções - ferro e cofragem de qualidade';
        } else if (src.includes('exterior')) {
          altText = 'Construção exterior RC Construções - projetos chave na mão';
        } else if (src.includes('og-image') || src.includes('logo')) {
          altText = 'RC Construções - Especialistas em construção civil Portugal';
        }
        
        img.setAttribute('alt', altText);
      });
    };

    // Optimize CSS delivery
    const optimizeCSSDelivery = () => {
      // Move non-critical CSS to async loading
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      stylesheets.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && !href.includes('critical') && !href.includes('fonts')) {
          link.setAttribute('media', 'print');
          link.setAttribute('onload', 'this.media="all"');
        }
      });
    };

    // Add performance marks for monitoring
    const addPerformanceMarks = () => {
      if ('performance' in window && 'mark' in performance) {
        performance.mark('seo-optimizer-start');
        
        // Mark when images are optimized
        setTimeout(() => {
          performance.mark('images-optimized');
        }, 100);
        
        // Mark when page is fully interactive
        window.addEventListener('load', () => {
          performance.mark('page-interactive');
          
          // Measure performance
          if ('measure' in performance) {
            performance.measure('seo-optimization-time', 'seo-optimizer-start', 'images-optimized');
          }
        });
      }
    };

    // Run optimizations
    setTimeout(() => {
      optimizeImages();
      addMissingAltTexts();
      optimizeCSSDelivery();
      addPerformanceMarks();
    }, 100);

    // Re-run when DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      addMissingAltTexts();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};

// Service Worker for caching (development helper)
export const registerSW = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);
};

export default SEOOptimizer;