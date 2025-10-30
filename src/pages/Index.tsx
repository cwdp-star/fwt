import { lazy, Suspense } from 'react';
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import ContactForm from "@/components/ContactForm";
import FloatingButtons from "@/components/FloatingButtons";
import WhatsAppChat from "@/components/WhatsAppChat";
import CookieConsent from "@/components/CookieConsent";
import { MetaTags, getOrganizationStructuredData } from "@/components/seo/MetaTags";

// Lazy load heavy components
const ProjectGallery = lazy(() => import("@/components/ProjectGallery"));
const FAQ = lazy(() => import("@/components/FAQ"));

const Index = () => {
  return (
    <div className="min-h-screen">
      <MetaTags 
        title="FTW Construções - Especialistas em Estruturas de Betão Armado"
        description="FTW Construções é especializada em estruturas de betão armado, ferro e cofragem. Serviços de construção civil de alta qualidade em todo Portugal. Solicite orçamento gratuito."
        keywords={[
          "FTW Construções",
          "betão armado",
          "ferro e cofragem", 
          "estruturas",
          "construção civil",
          "Portugal",
          "engenharia civil",
          "obras públicas",
          "construção comercial",
          "construção residencial",
          "orçamento gratuito"
        ]}
        canonical="https://rcconstrucoes.pt"
        structuredData={getOrganizationStructuredData()}
      />
      {/* Add top margin to account for fixed header */}
      <div className="mt-32">
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
          <ProjectGallery />
        </Suspense>
        <Suspense fallback={<div className="min-h-[300px]"></div>}>
          <FAQ />
        </Suspense>
        <ContactForm />
      </div>
      
      {/* Floating Buttons */}
      <FloatingButtons />
      
      {/* WhatsApp Chat */}
      <WhatsAppChat />
      
      {/* GDPR Cookie Consent */}
      <CookieConsent />
    </div>
  );
};

export default Index;
