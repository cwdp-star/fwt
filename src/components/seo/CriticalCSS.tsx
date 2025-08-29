import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export const CriticalCSS = () => {
  useEffect(() => {
    // Optimize font loading
    const optimizeFonts = () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap';
      link.as = 'style';
      link.onload = function() { 
        (this as any).onload = null; 
        (this as any).rel = 'stylesheet'; 
      };
      document.head.appendChild(link);
    };

    // Optimize image loading with intersection observer
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              
              // WebP conversion if supported
              if (img.src && !img.src.includes('.webp')) {
                const canvas = document.createElement('canvas');
                const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
                
                if (supportsWebP) {
                  const originalSrc = img.src;
                  const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                  
                  const testImg = new Image();
                  testImg.onload = () => {
                    img.src = webpSrc;
                  };
                  testImg.onerror = () => {
                    img.src = originalSrc;
                  };
                  testImg.src = webpSrc;
                }
              }
              
              imageObserver.unobserve(img);
            }
          });
        }, { rootMargin: '50px' });

        images.forEach(img => imageObserver.observe(img));
      }
    };

    setTimeout(() => {
      optimizeFonts();
      optimizeImages();
    }, 100);
  }, []);

  const criticalCSS = `
    /* Critical CSS for above-the-fold content */
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%);
    }
    
    .header-fixed {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 50;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
    }
    
    .loading-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* Preload animations */
    .fade-in-up {
      opacity: 0;
      transform: translateY(30px);
      animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <Helmet>
      <style>{criticalCSS}</style>
      
      {/* Resource hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Preload critical resources */}
      <link rel="preload" href="/og-image.jpg" as="image" />
      <link rel="preload" href="/placeholder-construction-1.jpg" as="image" />
      
      {/* Prefetch likely resources */}
      <link rel="prefetch" href="/placeholder-renovation-1.jpg" />
      <link rel="prefetch" href="/placeholder-exterior-1.jpg" />
    </Helmet>
  );
};