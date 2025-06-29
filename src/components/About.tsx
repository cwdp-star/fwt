
import { Hammer, CheckSquare, Shield } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Sobre a <span className="text-orange-500">Motivo Visionário</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Especialistas em armação de ferro e cofragem, construindo estruturas 
              sólidas e seguras para todos os tipos de projetos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1597740985671-5f3faeb5c7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Vergalhões de ferro para armação"
                className="rounded-lg shadow-2xl w-full h-96 object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Nossa Especialidade
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                A Motivo Visionário nasceu da paixão pelo trabalho com ferro e estruturas. 
                Nossa equipe especializada domina todas as técnicas de armação e cofragem, 
                garantindo estruturas resistentes e duradouras.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Trabalhamos com vergalhões de alta qualidade e seguimos rigorosamente 
                todas as normas técnicas de segurança. Cada projeto é executado com 
                precisão milimétrica e acompanhamento técnico constante.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Qualidade Superior</h4>
              <p className="text-gray-600">
                Utilizamos apenas vergalhões certificados e seguimos 
                rigorosamente as normas técnicas da ABNT.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Hammer className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Experiência Técnica</h4>
              <p className="text-gray-600">
                Mais de 12 anos de experiência em armação de ferro 
                e cofragem para estruturas de todos os portes.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Segurança Total</h4>
              <p className="text-gray-600">
                Todos os nossos profissionais são treinados e certificados, 
                garantindo máxima segurança na execução.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
