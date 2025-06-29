
import { building } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg">
                <building className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Gesso & Aço</h3>
                <p className="text-gray-400">Construção com Excelência</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Há mais de 15 anos transformando sonhos em realidade. 
              Especialistas em construção civil, reformas e acabamentos 
              de alta qualidade em toda a região.
            </p>
            <div className="text-sm text-gray-400">
              <p>CNPJ: 12.345.678/0001-90</p>
              <p>Licença: CREA-SP 123456</p>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-orange-400">Serviços</h4>
            <ul className="space-y-3 text-gray-300">
              <li>Construção Civil</li>
              <li>Reformas Completas</li>
              <li>Ampliações</li>
              <li>Acabamentos</li>
              <li>Gesso e Pintura</li>
              <li>Projetos Comerciais</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-orange-400">Contato</h4>
            <div className="space-y-3 text-gray-300">
              <div>
                <p className="font-medium">Telefone:</p>
                <p>(11) 3456-7890</p>
              </div>
              <div>
                <p className="font-medium">WhatsApp:</p>
                <p>(11) 99999-8888</p>
              </div>
              <div>
                <p className="font-medium">E-mail:</p>
                <p>contato@gessoaco.com.br</p>
              </div>
              <div>
                <p className="font-medium">Endereço:</p>
                <p>Rua das Construções, 123<br />Centro - São Paulo/SP</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Gesso & Aço. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                Trabalhe Conosco
              </a>
            </div>
          </div>
        </div>

        {/* Horário de atendimento */}
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <div className="text-center">
            <h5 className="text-lg font-semibold text-orange-400 mb-3">
              Horário de Atendimento
            </h5>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <p className="font-medium">Segunda a Sexta:</p>
                <p>8:00 às 18:00</p>
              </div>
              <div>
                <p className="font-medium">Sábados:</p>
                <p>8:00 às 12:00</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Plantão 24h para emergências: (11) 99999-0000
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
