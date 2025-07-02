
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
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium mb-8">
              Soluções Técnicas e Confiáveis para a Sua Obra
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Na Motivo Visionário, somos referência em armação de ferro para estruturas de betão. Com experiência, precisão e compromisso, oferecemos serviços de alta qualidade que garantem segurança e durabilidade à sua construção.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Trabalhadores executando armação de ferro em grande obra"
                className="rounded-xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                A Nossa Especialidade
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                A Motivo Visionário nasceu do apreço pelo trabalho bem feito em ferro e estruturas. A nossa equipa é especializada em executar com excelência todas as técnicas de armação e cofragem, assegurando estruturas resistentes e duradouras.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Atuamos exclusivamente com mão de obra qualificada, trabalhando com os materiais fornecidos pelo cliente. Seguimos rigorosamente todas as normas técnicas de segurança e garantimos um serviço com precisão milimétrica e acompanhamento técnico constante.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckSquare className="h-12 w-12 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Execução Especializada</h4>
              <p className="text-gray-700">
                Mão de obra experiente em armação de ferro e cofragem, com foco em precisão, eficiência e cumprimento de prazos.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Hammer className="h-12 w-12 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Experiência Técnica</h4>
              <p className="text-gray-700">
                Mais de 20 anos de experiência em armação de ferro e cofragem estrutural para obras de todos os portes.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-12 w-12 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Profissionais Qualificados</h4>
              <p className="text-gray-700">
                Equipa certificada e treinada para atuar com rigor técnico e atenção total aos detalhes em cada etapa da obra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
