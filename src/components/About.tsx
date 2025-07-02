
import { Hammer, CheckSquare, Shield } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sobre a <span className="text-orange-600">Motivo Visionário</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              Especialistas em armação de ferro e cofragem estrutural, 
              construindo estruturas sólidas e seguras para todos os tipos de obras.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1597740985671-5f3faeb5c7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Armação de ferro para estruturas"
                className="rounded-xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                A Nossa Especialidade
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                A Motivo Visionário nasceu da paixão pelo trabalho com ferro e estruturas. 
                A nossa equipa especializada domina todas as técnicas de armação e cofragem, 
                garantindo estruturas resistentes e duradoiras.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Trabalhamos com vergalhões de alta qualidade e seguimos rigorosamente 
                todas as normas técnicas de segurança. Cada projeto é executado com 
                precisão milimétrica e acompanhamento técnico constante.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckSquare className="h-12 w-12 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Qualidade Superior</h4>
              <p className="text-gray-700">
                Utilizamos apenas vergalhões certificados e seguimos 
                rigorosamente as normas técnicas europeias.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Hammer className="h-12 w-12 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Experiência Técnica</h4>
              <p className="text-gray-700">
                Mais de 15 anos de experiência em armação de ferro 
                e cofragem estrutural para obras de todos os portes.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-12 w-12 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Segurança Total</h4>
              <p className="text-gray-700">
                Todos os nossos profissionais são certificados, 
                garantindo máxima segurança na execução das obras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
