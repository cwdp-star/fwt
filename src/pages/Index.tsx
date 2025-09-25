
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import ContactForm from "@/components/ContactForm";
import { MetaTags, getOrganizationStructuredData } from "@/components/seo/MetaTags";

const Index = () => {
  return (
    <div className="min-h-screen">
      <MetaTags 
        title="RC Construções - Especialistas em Estruturas de Betão Armado"
        description="RC Construções é especializada em estruturas de betão armado, ferro e cofragem. Serviços de construção civil de alta qualidade em todo Portugal. Solicite orçamento gratuito."
        keywords={[
          "RC Construções",
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
        <ContactForm />
      </div>
    </div>
  );
};

export default Index;
