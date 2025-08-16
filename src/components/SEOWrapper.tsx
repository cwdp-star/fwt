import React from 'react';
import { MetaTags, getOrganizationStructuredData } from '@/components/seo/MetaTags';

interface SEOWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
}

export const SEOWrapper: React.FC<SEOWrapperProps> = ({
  children,
  title,
  description,
  keywords,
  canonical,
  ogImage,
  structuredData
}) => {
  return (
    <>
      <MetaTags
        title={title}
        description={description}
        keywords={keywords}
        canonical={canonical}
        ogImage={ogImage}
        structuredData={structuredData || getOrganizationStructuredData()}
      />
      {children}
    </>
  );
};

export default SEOWrapper;