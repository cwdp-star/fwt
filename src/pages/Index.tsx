
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
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
