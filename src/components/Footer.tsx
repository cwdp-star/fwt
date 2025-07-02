
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center p-2">
                <img 
                  src="/lovable-uploads/dfdb0f79-49d1-438c-b58d-fc91a779077d.png" 
                  alt="Motivo Visionário Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Motivo Visionário</h3>
                <p className="text-orange-400 font-semibold">Ferro e Cofragem</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              Há mais de 15 anos especialistas em armação de ferro e cofragem estrutural. 
              Oferecemos estruturas sólidas e seguras para habitações, 
              empresas e indústrias em toda a região.
            </p>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-orange-400">Serviços</h4>
            <ul className="space-y-3 text-gray-300">
              <li>Armação de Ferro</li>
              <li>Cofragem Estrutural</li>
              <li>Lajes e Vigas</li>
              <li>Pilares e Fundações</li>
              <li>Escadas de Betão</li>
              <li>Sistemas de Escoramento</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-orange-400">Contacto</h4>
            <div className="space-y-4 text-gray-300">
              <div>
                <p className="font-semibold text-white">Telefone:</p>
                <p className="text-lg">+351 912 363 935</p>
              </div>
              <div>
                <p className="font-semibold text-white">Email:</p>
                <p>geral@motivovisionario.pt</p>
              </div>
              <div>
                <p className="font-semibold text-white">Morada:</p>
                <p>Av. Via Láctea 41<br />2635-581 Rinchoa</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 Motivo Visionário. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>

        {/* Horário de atendimento */}
        <div className="mt-8 p-6 bg-gray-800 rounded-xl">
          <div className="text-center">
            <h5 className="text-xl font-bold text-orange-400 mb-4">
              Horário de Atendimento
            </h5>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <p className="font-semibold text-white">Segunda a Sexta:</p>
                <p className="text-lg">08:00 às 18:00</p>
              </div>
              <div>
                <p className="font-semibold text-white">Sábados:</p>
                <p className="text-lg">08:00 às 13:00</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Contacto de emergência: +351 912 363 935
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
