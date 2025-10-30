import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useEffect } from 'react';

const FAQ = () => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const faqs = [
    {
      question: "Que tipo de serviços de construção oferecem?",
      answer: "Oferecemos uma gama completa de serviços de construção civil, incluindo estruturas de betão armado, ferro e cofragem, construção de raiz, remodelações, ampliações e acabamentos de luxo. Trabalhamos em projetos residenciais e comerciais de qualquer dimensão."
    },
    {
      question: "Quanto tempo demora um projeto de construção?",
      answer: "O prazo varia consoante a complexidade e dimensão do projeto. Uma remodelação pode demorar de 2 a 6 meses, enquanto uma construção de raiz pode levar de 12 a 24 meses. Fornecemos sempre um cronograma detalhado no orçamento."
    },
    {
      question: "Fornecem orçamentos gratuitos?",
      answer: "Sim! Oferecemos orçamentos gratuitos e sem compromisso. Basta preencher o nosso formulário de contacto com os detalhes do seu projeto, e entraremos em contacto no prazo de 24-48 horas."
    },
    {
      question: "Quais as zonas geográficas onde atuam?",
      answer: "Atuamos principalmente na região de Lisboa e arredores, mas também aceitamos projetos em todo o território nacional para obras de maior dimensão. Contacte-nos para confirmar se trabalhamos na sua área."
    },
    {
      question: "Precisam de licenças e autorizações para construir?",
      answer: "Sim, a maioria dos projetos de construção e remodelação requer licenças municipais. Oferecemos apoio completo no processo de licenciamento, trabalhando com arquitetos e engenheiros para garantir que todos os requisitos legais são cumpridos."
    },
    {
      question: "Oferecem garantia nos trabalhos realizados?",
      answer: "Sim, todos os nossos trabalhos incluem garantia. A duração varia conforme o tipo de trabalho realizado, mas garantimos sempre a qualidade dos materiais e da mão-de-obra. Os detalhes da garantia são especificados no contrato."
    },
    {
      question: "Posso acompanhar o progresso da obra?",
      answer: "Absolutamente! Mantemos comunicação regular com os nossos clientes e fornecemos atualizações fotográficas do progresso. Também pode visitar a obra mediante agendamento prévio."
    },
    {
      question: "Trabalham com que tipo de materiais?",
      answer: "Trabalhamos com materiais de primeira qualidade de fornecedores certificados. Podemos adaptar-nos às suas preferências e orçamento, oferecendo sempre várias opções de materiais e acabamentos."
    },
    {
      question: "Como funciona o processo de pagamento?",
      answer: "Normalmente, trabalhamos com um sistema de pagamentos faseados: sinal inicial, pagamentos intermédios conforme o progresso da obra e pagamento final após conclusão. Os termos específicos são acordados no contrato e adaptados a cada projeto."
    },
    {
      question: "Têm seguro de responsabilidade civil?",
      answer: "Sim, possuímos seguro de responsabilidade civil que cobre todos os nossos trabalhos e garante a proteção dos nossos clientes contra eventuais danos ou acidentes durante a obra."
    }
  ];

  // Add FAQ Schema Markup
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    script.id = 'faq-schema';
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('faq-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <section id="faq" className="py-16 bg-gradient-to-br from-muted/20 via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div ref={elementRef} className="text-center mb-12">
            <div className={`flex items-center justify-center space-x-3 mb-4 transition-all duration-700 ${
              isVisible ? 'animate-fade-in-down' : 'opacity-0'
            }`}>
              <HelpCircle className="h-10 w-10 text-primary animate-float" />
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Perguntas <span className="text-primary">Frequentes</span>
              </h2>
            </div>
            <p className={`text-lg text-foreground/80 max-w-2xl mx-auto transition-all duration-700 ${
              isVisible ? 'animate-fade-in-up-delay-200' : 'opacity-0'
            }`}>
              Encontre respostas para as questões mais comuns sobre os nossos serviços de construção
            </p>
          </div>

          <div className={`transition-all duration-700 ${
            isVisible ? 'animate-fade-in-up-delay-400' : 'opacity-0'
          }`}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6 hover:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:text-primary hover:no-underline py-5">
                    <span className="font-semibold text-base">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Não encontrou a resposta que procurava?
            </p>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Entre em Contacto
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
