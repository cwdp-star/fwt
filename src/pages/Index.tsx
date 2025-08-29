
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { EnhancedSEO } from "@/components/seo/EnhancedSEO";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { WebVitalsTracker, preloadCriticalResources } from "@/components/seo/WebVitalsTracker";

const Index = () => {
  // Preload critical resources for performance
  preloadCriticalResources();

  return (
    <div className="min-h-screen">
      <EnhancedSEO 
        title="RC Construções - Especialistas em Estruturas de Betão Armado | Construção Civil Portugal"
        description="✓ RC Construções - Especialistas em betão armado, ferro e cofragem ✓ +15 anos experiência ✓ Construção civil de qualidade superior em Portugal ✓ Orçamento gratuito ✓ Projetos chave na mão"
        canonical="https://rcconstrucoes.pt"
        breadcrumbs={[
          { name: "Início", url: "/" }
        ]}
      />
      <LocalBusinessSchema />
      <WebVitalsTracker />
      <Header />
      {/* Add top margin to account for fixed header */}
      <div className="mt-32">
        <Hero />
        <About />
        <Services />
        <Gallery />
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
