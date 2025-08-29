import { Helmet } from 'react-helmet-async';

interface SocialMediaOptimizerProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export const SocialMediaOptimizer: React.FC<SocialMediaOptimizerProps> = ({
  title = "RC Construções - Especialistas em Estruturas de Betão Armado",
  description = "✓ Especialistas em betão armado ✓ Ferro e cofragem ✓ 15+ anos experiência ✓ Construção civil qualidade superior ✓ Portugal ✓ Orçamento gratuito",
  image = "/og-image.jpg",
  url = "https://rcconstrucoes.pt",
  type = "website"
}) => {
  const fullImageUrl = image.startsWith('http') ? image : `https://rcconstrucoes.pt${image}`;

  return (
    <Helmet>
      {/* Enhanced Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:secure_url" content={fullImageUrl} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="RC Construções - Estruturas de Betão Armado Portugal" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="RC Construções" />
      <meta property="og:locale" content="pt_PT" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {/* Enhanced Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@rcconstrucoes" />
      <meta name="twitter:creator" content="@rcconstrucoes" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content="RC Construções - Estruturas de Betão Armado Portugal" />
      
      {/* LinkedIn specific */}
      <meta name="linkedin:owner" content="RC Construções" />
      
      {/* WhatsApp sharing */}
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      
      {/* Pinterest Rich Pins */}
      <meta name="pinterest-rich-pin" content="true" />
      
      {/* Additional social media meta tags */}
      <meta name="application-name" content="RC Construções" />
      <meta name="apple-mobile-web-app-title" content="RC Construções" />
      <meta name="msapplication-tooltip" content="RC Construções - Construção Civil Portugal" />
      
      {/* Schema.org for Social Media */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "RC Construções",
          "url": "https://rcconstrucoes.pt",
          "logo": "https://rcconstrucoes.pt/logo.png",
          "sameAs": [
            "https://www.facebook.com/rcconstrucoes",
            "https://www.linkedin.com/company/rcconstrucoes",
            "https://www.instagram.com/rcconstrucoes",
            "https://twitter.com/rcconstrucoes"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+351-XXX-XXX-XXX",
            "contactType": "customer service",
            "availableLanguage": ["Portuguese", "English"]
          }
        })}
      </script>
    </Helmet>
  );
};