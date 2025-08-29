import { Helmet } from 'react-helmet-async';

export const LocalBusinessSchema = () => {
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://rcconstrucoes.pt/#organization",
    "name": "RC Construções",
    "alternateName": "RC Construções Lda",
    "description": "Empresa de construção civil especializada em estruturas de betão armado, ferro e cofragem com mais de 15 anos de experiência no mercado português.",
    "url": "https://rcconstrucoes.pt",
    "telephone": "+351-XXX-XXX-XXX",
    "email": "info@rcconstrucoes.pt",
    "foundingDate": "2009",
    "logo": "https://rcconstrucoes.pt/logo.png",
    "image": [
      "https://rcconstrucoes.pt/og-image.jpg",
      "https://rcconstrucoes.pt/placeholder-construction-1.jpg",
      "https://rcconstrucoes.pt/placeholder-renovation-1.jpg"
    ],
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
    "areaServed": [
      {
        "@type": "Country",
        "name": "Portugal"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Lisboa"
      },
      {
        "@type": "AdministrativeArea", 
        "name": "Porto"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Coimbra"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "39.3999",
        "longitude": "-8.2245"
      },
      "geoRadius": "200000"
    },
    "priceRange": "€€€",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer", "Check"],
    "currenciesAccepted": "EUR",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/rcconstrucoes",
      "https://www.linkedin.com/company/rcconstrucoes",
      "https://www.instagram.com/rcconstrucoes"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "João Silva"
        },
        "reviewBody": "Excelente trabalho da RC Construções. Profissionais competentes e obra entregue no prazo. Recomendo vivamente!"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Construção Civil",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Estruturas de Betão Armado",
            "description": "Construção especializada de estruturas em betão armado com garantia de qualidade e durabilidade.",
            "provider": {
              "@type": "Organization",
              "name": "RC Construções"
            },
            "areaServed": "Portugal",
            "availableChannel": {
              "@type": "ServiceChannel",
              "serviceUrl": "https://rcconstrucoes.pt",
              "serviceSmsNumber": "+351-XXX-XXX-XXX"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Ferro e Cofragem",
            "description": "Serviços especializados em ferro e cofragem para construção civil de alta qualidade.",
            "provider": {
              "@type": "Organization",
              "name": "RC Construções"
            },
            "areaServed": "Portugal"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Projetos Chave na Mão", 
            "description": "Gestão completa de projetos de construção da planta ao acabamento final.",
            "provider": {
              "@type": "Organization",
              "name": "RC Construções"
            },
            "areaServed": "Portugal"
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessData)}
      </script>
    </Helmet>
  );
};