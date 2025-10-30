import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = "FTW Construções - Especialistas em Estruturas de Betão Armado",
  description = "FTW Construções é especializada em estruturas de betão armado, ferro e cofragem. Serviços de construção civil de alta qualidade em todo Portugal.",
  keywords = [
    "FTW Construções",
    "betão armado",
    "ferro e cofragem", 
    "estruturas",
    "construção civil",
    "Portugal",
    "engenharia civil",
    "obras públicas",
    "construção comercial",
    "construção residencial"
  ],
  canonical,
  ogTitle,
  ogDescription,
  ogImage = "/og-image.jpg",
  ogType = "website",
  structuredData,
}) => {
  const fullTitle = title.includes("FTW Construções") ? title : `${title} | FTW Construções`;
  const metaDescription = description.length > 160 ? description.substring(0, 157) + "..." : description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords.join(", ")} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="FTW Construções" />
      <meta property="og:locale" content="pt_PT" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="FTW Construções" />
      <meta name="language" content="Portuguese" />
      <meta name="geo.region" content="PT" />
      <meta name="geo.placename" content="Portugal" />
      
      {/* Business Information */}
      <meta name="business:contact_data:locality" content="Portugal" />
      <meta name="business:contact_data:region" content="PT" />
      <meta name="business:contact_data:country_name" content="Portugal" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Predefined structured data for different page types
export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FTW Construções",
  "description": "Especialistas em estruturas de betão armado, ferro e cofragem. Serviços de construção civil de alta qualidade.",
  "url": "https://rcconstrucoes.pt",
  "logo": "https://rcconstrucoes.pt/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+351-XXX-XXX-XXX",
    "contactType": "customer service",
    "availableLanguage": "Portuguese"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "PT",
    "addressRegion": "Portugal"
  },
  "sameAs": [
    "https://www.facebook.com/rcconstrucoes",
    "https://www.linkedin.com/company/rcconstrucoes"
  ],
  "knowsAbout": [
    "Betão armado",
    "Ferro e cofragem",
    "Estruturas",
    "Construção civil",
    "Engenharia civil"
  ]
});

export const getConstructionProjectStructuredData = (project: any) => ({
  "@context": "https://schema.org",
  "@type": "ConstructionBusiness",
  "name": project.title,
  "description": project.description,
  "image": project.cover_image,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": project.city,
    "addressCountry": "PT"
  },
  "provider": {
    "@type": "Organization",
    "name": "FTW Construções"
  },
  "startDate": project.start_date,
  "endDate": project.end_date
});