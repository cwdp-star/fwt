import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal = ({ onClose }: PrivacyPolicyModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Política de Privacidade e Proteção de Dados</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-PT')}
            </p>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">1. Introdução</h3>
              <p className="text-gray-700 mb-3">
                A RC Construções ("nós", "nosso" ou "empresa") compromete-se a proteger e respeitar a sua privacidade. 
                Esta Política de Privacidade explica como recolhemos, utilizamos, armazenamos e protegemos os seus dados pessoais, 
                em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD - Regulamento UE 2016/679) e a legislação portuguesa aplicável.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">2. Responsável pelo Tratamento de Dados</h3>
              <p className="text-gray-700 mb-2"><strong>Entidade:</strong> RC Construções, Lda.</p>
              <p className="text-gray-700 mb-2"><strong>NIF:</strong> [Inserir NIF]</p>
              <p className="text-gray-700 mb-2"><strong>Morada:</strong> [Inserir morada completa]</p>
              <p className="text-gray-700 mb-2"><strong>Email de Contacto:</strong> privacidade@rcconstrucoes.pt</p>
              <p className="text-gray-700">Para questões relacionadas com a proteção de dados, pode contactar-nos através do email acima indicado.</p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">3. Dados Pessoais que Recolhemos</h3>
              <p className="text-gray-700 mb-3">Recolhemos e processamos as seguintes categorias de dados pessoais:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Dados de Identificação:</strong> Nome completo, email, número de telefone</li>
                <li><strong>Dados do Projeto:</strong> Tipo de projeto, localização da obra, orçamento previsto, prazo desejado, descrição da obra</li>
                <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas, tempo de permanência (apenas cookies técnicos essenciais)</li>
                <li><strong>Dados de Comunicação:</strong> Histórico de contactos, mensagens trocadas, documentos partilhados</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">4. Finalidades e Fundamentos Legais do Tratamento</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">4.1. Resposta a Pedidos de Orçamento</p>
                  <p className="text-gray-700 mb-1"><strong>Finalidade:</strong> Processar e responder ao seu pedido de orçamento</p>
                  <p className="text-gray-700"><strong>Base Legal:</strong> Consentimento explícito (RGPD Art. 6.º, n.º 1, alínea a) e execução de diligências pré-contratuais (RGPD Art. 6.º, n.º 1, alínea b)</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">4.2. Contacto Comercial</p>
                  <p className="text-gray-700 mb-1"><strong>Finalidade:</strong> Comunicações relacionadas com os nossos serviços</p>
                  <p className="text-gray-700"><strong>Base Legal:</strong> Consentimento explícito (RGPD Art. 6.º, n.º 1, alínea a)</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">4.3. Cumprimento de Obrigações Legais</p>
                  <p className="text-gray-700 mb-1"><strong>Finalidade:</strong> Cumprimento de obrigações fiscais, contabilísticas e legais</p>
                  <p className="text-gray-700"><strong>Base Legal:</strong> Cumprimento de obrigação legal (RGPD Art. 6.º, n.º 1, alínea c)</p>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">5. Partilha de Dados com Terceiros</h3>
              <p className="text-gray-700 mb-3">
                Os seus dados pessoais não são vendidos, alugados ou partilhados com terceiros para fins de marketing. 
                Apenas partilhamos os seus dados nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Prestadores de Serviços:</strong> Empresas que nos prestam serviços (alojamento web, email), vinculadas por acordo de confidencialidade</li>
                <li><strong>Subcontratados:</strong> Quando necessário para a execução do projeto (mediante consentimento prévio)</li>
                <li><strong>Autoridades Competentes:</strong> Quando legalmente obrigados</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Todos os terceiros com acesso aos seus dados estão obrigados a cumprir o RGPD e a legislação de proteção de dados aplicável.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">6. Transferências Internacionais de Dados</h3>
              <p className="text-gray-700">
                Os seus dados pessoais são armazenados e processados dentro da União Europeia. Não realizamos transferências 
                de dados para países terceiros fora do Espaço Económico Europeu (EEE).
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">7. Período de Conservação dos Dados</h3>
              <p className="text-gray-700 mb-3">Conservamos os seus dados pessoais durante os seguintes períodos:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Pedidos de Orçamento não concretizados:</strong> 2 anos após a última interação</li>
                <li><strong>Projetos concretizados:</strong> 10 anos (cumprimento de obrigações legais e garantias)</li>
                <li><strong>Dados de contacto para marketing:</strong> Até retirar o consentimento</li>
                <li><strong>Dados contabilísticos e fiscais:</strong> 10 anos (Lei Geral Tributária)</li>
              </ul>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">8. Os Seus Direitos (RGPD)</h3>
              <p className="text-gray-700 mb-3">Nos termos do RGPD, tem os seguintes direitos:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Direito de Acesso (Art. 15.º):</strong> Obter confirmação sobre o tratamento dos seus dados e acesso aos mesmos</li>
                <li><strong>Direito de Retificação (Art. 16.º):</strong> Corrigir dados inexatos ou incompletos</li>
                <li><strong>Direito ao Apagamento/"Direito a Ser Esquecido" (Art. 17.º):</strong> Solicitar a eliminação dos seus dados</li>
                <li><strong>Direito à Limitação do Tratamento (Art. 18.º):</strong> Restringir o processamento dos seus dados</li>
                <li><strong>Direito à Portabilidade dos Dados (Art. 20.º):</strong> Receber os seus dados em formato estruturado</li>
                <li><strong>Direito de Oposição (Art. 21.º):</strong> Opor-se ao tratamento dos seus dados</li>
                <li><strong>Direito de Retirar o Consentimento:</strong> Retirar o consentimento a qualquer momento</li>
                <li><strong>Direito de Apresentar Reclamação:</strong> Junto da CNPD (Comissão Nacional de Proteção de Dados)</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Para exercer qualquer destes direitos, contacte-nos através de: <strong>privacidade@rcconstrucoes.pt</strong>
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">9. Medidas de Segurança</h3>
              <p className="text-gray-700 mb-3">
                Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Acesso não autorizado ou ilegal</li>
                <li>Destruição, perda ou alteração acidental</li>
                <li>Divulgação ou acesso não autorizado</li>
              </ul>
              <p className="text-gray-700 mt-3">
                As medidas incluem: encriptação de dados em trânsito e repouso, controlo de acessos, auditorias regulares e formação de colaboradores.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">10. Cookies e Tecnologias Similares</h3>
              <p className="text-gray-700">
                Utilizamos apenas cookies técnicos essenciais para o funcionamento do website. Para mais informações, 
                consulte a nossa <strong>Política de Cookies</strong>.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">11. Alterações a Esta Política</h3>
              <p className="text-gray-700">
                Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente. As alterações entrarão 
                em vigor imediatamente após a sua publicação no website. Recomendamos que reveja regularmente esta política.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">12. Contactos</h3>
              <p className="text-gray-700 mb-2">
                Para questões sobre esta Política de Privacidade ou sobre o tratamento dos seus dados pessoais:
              </p>
              <p className="text-gray-700 mb-1"><strong>Email:</strong> privacidade@rcconstrucoes.pt</p>
              <p className="text-gray-700 mb-1"><strong>Telefone:</strong> [Inserir número]</p>
              <p className="text-gray-700"><strong>Morada:</strong> [Inserir morada completa]</p>
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">13. Autoridade de Controlo</h3>
              <p className="text-gray-700 mb-2">
                Tem o direito de apresentar reclamação junto da autoridade de controlo competente:
              </p>
              <p className="text-gray-700 mb-1"><strong>CNPD - Comissão Nacional de Proteção de Dados</strong></p>
              <p className="text-gray-700 mb-1">Av. D. Carlos I, 134, 1.º</p>
              <p className="text-gray-700 mb-1">1200-651 Lisboa</p>
              <p className="text-gray-700 mb-1">Tel: +351 213 928 400</p>
              <p className="text-gray-700">Email: geral@cnpd.pt | Website: www.cnpd.pt</p>
            </section>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 border-t">
          <Button onClick={onClose} className="w-full bg-primary hover:bg-accent">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
