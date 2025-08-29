import React from 'react';
import { Helmet } from 'react-helmet-async';

interface EnhancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  structuredData?: object[];
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
  title = "RC Construções - Especialistas em Estruturas de Betão Armado",
  description = "RC Construções é especializada em estruturas de betão armado, ferro e cofragem. Serviços de construção civil de alta qualidade em todo Portugal. ✓ Orçamento Gratuito ✓ 15 anos experiência ✓ Qualidade garantida",
  keywords = [
    "RC Construções",
    "betão armado portugal", 
    "ferro e cofragem",
    "estruturas construção",
    "construção civil qualidade",
    "engenharia civil portugal",
    "obras públicas portugal",
    "construção comercial",
    "construção residencial",
    "orçamento construção gratuito",
    "empresa construção certificada",
    "estruturas duradouras"
  ],
  canonical = "https://rcconstrucoes.pt",
  ogImage = "/og-image.jpg",
  structuredData = [],
  breadcrumbs = []
}) => {
  const fullTitle = title.includes("RC Construções") ? title : `${title} | RC Construções`;
  const metaDescription = description.length > 160 ? description.substring(0, 157) + "..." : description;

  // Enhanced Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "ConstructionBusiness",
    "name": "RC Construções",
    "alternateName": ["RC Construcoes", "RC Construções Lda"],
    "description": "Empresa especializada em estruturas de betão armado, ferro e cofragem com mais de 15 anos de experiência no mercado português.",
    "url": "https://rcconstrucoes.pt",
    "logo": "https://rcconstrucoes.pt/logo.png",
    "image": "https://rcconstrucoes.pt/og-image.jpg",
    "telephone": "+351-XXX-XXX-XXX",
    "email": "info@rcconstrucoes.pt",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PT",
      "addressRegion": "Portugal"
    },
    "geo": {
      "@type": "GeoCoordinates", 
      "latitude": "39.3999",
      "longitude": "-8.2245"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Portugal"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "39.3999", 
        "longitude": "-8.2245"
      },
      "geoRadius": "200000"
    },
    "foundingDate": "2009",
    "numberOfEmployees": "10-50",
    "priceRange": "€€€",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "currenciesAccepted": "EUR",
    "openingHours": "Mo-Fr 08:00-18:00",
    "sameAs": [
      "https://www.facebook.com/rcconstrucoes",
      "https://www.linkedin.com/company/rcconstrucoes"
    ],
    "knowsAbout": [
      "Estruturas de betão armado",
      "Ferro e cofragem",
      "Construção civil",
      "Engenharia estrutural",
      "Obras públicas",
      "Construção comercial",
      "Construção residencial",
      "Reabilitação urbana"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Construção",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Estruturas de Betão Armado",
            "description": "Construção de estruturas sólidas e duradouras em betão armado"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Ferro e Cofragem",
            "description": "Serviços especializados em ferro e cofragem para construção civil"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Projetos Chave na Mão",
            "description": "Gestão completa de projetos da planta ao acabamento final"
          }
        }
      ]
    }
  };

  // FAQ structured data
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Que serviços oferece a RC Construções?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A RC Construções oferece serviços especializados em estruturas de betão armado, ferro e cofragem, construção de habitações, remodelações e projetos chave na mão com mais de 15 anos de experiência."
        }
      },
      {
        "@type": "Question", 
        "name": "A RC Construções trabalha em todo o Portugal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, a RC Construções presta serviços em todo o território nacional português, desde pequenas remodelações a grandes obras de construção civil."
        }
      },
      {
        "@type": "Question",
        "name": "Como posso solicitar um orçamento?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pode solicitar um orçamento gratuito através do nosso formulário de contacto no website, por telefone ou email. Respondemos rapidamente com uma proposta personalizada."
        }
      }
    ]
  };

  // Breadcrumb structured data
  const breadcrumbData = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList", 
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://rcconstrucoes.pt${crumb.url}`
    }))
  } : null;

  const allStructuredData = [
    organizationData,
    faqData,
    ...structuredData,
    ...(breadcrumbData ? [breadcrumbData] : [])
  ];

  return (
    <Helmet>
      {/* Enhanced Title & Description */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords.join(", ")} />
      
      {/* Enhanced meta tags */}
      <meta name="author" content="RC Construções" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="Portuguese" />
      <meta name="geo.region" content="PT" />
      <meta name="geo.country" content="Portugal" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Enhanced Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={`https://rcconstrucoes.pt${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="RC Construções" />
      <meta property="og:locale" content="pt_PT" />
      
      {/* Enhanced Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={`https://rcconstrucoes.pt${ogImage}`} />
      <meta name="twitter:site" content="@rcconstrucoes" />
      <meta name="twitter:creator" content="@rcconstrucoes" />
      
      {/* Business & Local SEO */}
      <meta name="business:contact_data:locality" content="Portugal" />
      <meta name="business:contact_data:region" content="PT" />
      <meta name="business:contact_data:country_name" content="Portugal" />
      
      {/* Technical SEO */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Preload critical resources */}
      <link rel="preload" href="/og-image.jpg" as="image" />
      <link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" as="style" />
      
      {/* DNS prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      
      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default EnhancedSEO;