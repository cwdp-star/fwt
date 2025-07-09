
import { Hammer, CheckSquare, Shield } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
              Sobre a <span className="text-primary">RC Construções</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium mb-8">
              Excelência em Construção Civil e Remodelação
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              A RC Construções é sinónimo de qualidade estrutural e excelência construtiva. Especializamo-nos em projetos de construção civil, remodelações completas e projetos chave na mão, sempre com foco na durabilidade e segurança das estruturas que construímos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Construção moderna em andamento"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-secondary mb-6">
                A Nossa Missão
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                A RC Construções dedica-se à construção de estruturas sólidas e duradouras. Especializamo-nos em construção nova, remodelações completas e projetos chave na mão, sempre com foco na qualidade estrutural e segurança.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Trabalhamos com materiais certificados e técnicas avançadas de construção. Cada projeto recebe controlo rigoroso de qualidade desde as fundações até aos acabamentos, garantindo estruturas robustas e duradouras.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckSquare className="h-12 w-12 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-secondary mb-4">Qualidade Garantida</h4>
              <p className="text-gray-700">
                Utilizamos materiais de primeira qualidade e técnicas modernas de construção para garantir durabilidade e acabamentos perfeitos.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Hammer className="h-12 w-12 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-secondary mb-4">Experiência Comprovada</h4>
              <p className="text-gray-700">
                Mais de 15 anos no mercado da construção civil, com centenas de projetos realizados com sucesso e clientes satisfeitos.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-secondary mb-4">Compromisso Total</h4>
              <p className="text-gray-700">
                Comprometemo-nos com prazos, orçamentos e especificações técnicas, oferecendo transparência total em todas as fases do projeto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
