
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-16 bg-white rounded-xl shadow-md flex items-center justify-center p-3">
                <img 
                  src="/lovable-uploads/2637c813-1f59-4fc8-82f5-a5c27d976878.png" 
                  alt="RC Construções Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold">RC Construções</h3>
                <p className="text-primary font-semibold">Construção & Remodelação</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              Há mais de 15 anos especializados em construção civil e remodelações completas. 
              Oferecemos soluções inovadoras da planta à chave na mão para 
              habitações, comércios e indústrias em toda a região.
            </p>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary">Serviços</h4>
            <ul className="space-y-3 text-gray-300">
              <li>Construção Nova</li>
              <li>Remodelações Completas</li>
              <li>Obras de Renovação</li>
              <li>Acabamentos Premium</li>
              <li>Projeto e Licenciamento</li>
              <li>Ampliações e Anexos</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary">Contacto</h4>
            <div className="space-y-4 text-gray-300">
              <div>
                <p className="font-semibold text-white">Telefone:</p>
                <p className="text-lg">+351 965 123 456</p>
              </div>
              <div>
                <p className="font-semibold text-white">Email:</p>
                <p>geral@rcconstrucoes.pt</p>
              </div>
              <div>
                <p className="font-semibold text-white">Morada:</p>
                <p>Rua da Construção 123<br />4000-000 Porto</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 mb-2">
                © 2025 RC Construções. Todos os direitos reservados.
              </p>
              <p className="text-gray-400 text-sm">
                <span className="font-semibold">Alvará de Construção:</span> 987654 - Empresa Licenciada
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>

        {/* Horário de atendimento */}
        <div className="mt-8 p-6 bg-gray-800 rounded-xl">
          <div className="text-center">
            <h5 className="text-xl font-bold text-primary mb-4">
              Horário de Atendimento
            </h5>
            <div className="grid gap-4 text-gray-300 place-items-center text-center">
              <div>
                <p className="font-semibold text-white">Segunda a Sexta:</p>
                <p className="text-lg">08:00 às 18:00</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Contacto de emergência: +351 965 123 456
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
