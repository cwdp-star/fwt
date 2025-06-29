
import { hammer, square-check, square } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Sobre a <span className="text-orange-500">Gesso & Aço</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fundada com o compromisso de entregar excelência em cada projeto, 
              somos especialistas em transformar espaços com qualidade e inovação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Equipe Gesso e Aço"
                className="rounded-lg shadow-2xl w-full h-96 object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Nossa História
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nascemos da paixão por construir e da determinação em superar desafios. 
                Ao longo dos anos, desenvolvemos uma metodologia única que combina 
                tradição e inovação, garantindo resultados excepcionais.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Cada projeto é tratado com dedicação máxima, desde o planejamento 
                até a entrega final. Nossa equipe é formada por profissionais 
                altamente qualificados e comprometidos com a excelência.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <square-check className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Qualidade Garantida</h4>
              <p className="text-gray-600">
                Utilizamos apenas materiais de primeira linha e seguimos 
                rigorosamente as normas técnicas de construção.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <hammer className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Experiência Sólida</h4>
              <p className="text-gray-600">
                Mais de 15 anos de mercado nos deram a expertise necessária 
                para lidar com projetos de qualquer complexidade.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <square className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Prazos Cumpridos</h4>
              <p className="text-gray-600">
                Nosso planejamento detalhado e gestão eficiente garantem 
                a entrega dentro do prazo estabelecido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
