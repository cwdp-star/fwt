import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsOfServiceModalProps {
  onClose: () => void;
}

const TermsOfServiceModal = ({ onClose }: TermsOfServiceModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-foreground">Termos e Condições de Serviço</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <ScrollArea className="h-[60vh] px-6">
          <div className="space-y-6 text-sm py-6">
            <p className="text-muted-foreground leading-relaxed">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-PT')}
            </p>

            <section>
              <h3 className="font-semibold text-base mb-3">1. Aceitação dos Termos</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ao utilizar o website da RC Construções e solicitar os nossos serviços, concorda com estes Termos e Condições de Serviço. 
                Se não concordar com algum aspeto destes termos, por favor não utilize os nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">2. Serviços Oferecidos</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                A RC Construções oferece serviços de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Construção civil e obras de raiz</li>
                <li>Remodelações e renovações</li>
                <li>Estruturas de betão armado</li>
                <li>Ampliações e modificações</li>
                <li>Acabamentos e manutenção</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">3. Orçamentos e Contratos</h3>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>3.1. Orçamentos:</strong> Os orçamentos fornecidos são válidos por 30 dias e baseiam-se nas informações fornecidas pelo cliente.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>3.2. Contratos:</strong> Todos os trabalhos são formalizados através de contrato escrito detalhando escopo, prazos e valores.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>3.3. Alterações:</strong> Qualquer alteração ao projeto original será formalizada por escrito e pode resultar em ajustes de prazo e valor.
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">4. Pagamentos</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Os pagamentos seguem o cronograma acordado em contrato:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Sinal inicial: Percentagem acordada na assinatura do contrato</li>
                <li>Pagamentos intermédios: Conforme progresso da obra</li>
                <li>Pagamento final: Após conclusão e aprovação dos trabalhos</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">5. Garantias</h3>
              <p className="text-muted-foreground leading-relaxed">
                Todos os trabalhos incluem garantia conforme especificado em contrato. A garantia cobre defeitos de execução mas não se aplica a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-2">
                <li>Desgaste normal</li>
                <li>Má utilização ou falta de manutenção</li>
                <li>Danos causados por terceiros</li>
                <li>Alterações não autorizadas</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">6. Responsabilidades do Cliente</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">O cliente compromete-se a:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Fornecer informações precisas e completas</li>
                <li>Garantir acesso ao local da obra</li>
                <li>Obter licenças necessárias (quando aplicável)</li>
                <li>Efetuar pagamentos nos prazos acordados</li>
                <li>Comunicar prontamente qualquer preocupação</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">7. Limitação de Responsabilidade</h3>
              <p className="text-muted-foreground leading-relaxed">
                A RC Construções não se responsabiliza por atrasos ou danos causados por força maior, condições climatéricas adversas, 
                greves ou circunstâncias fora do nosso controlo razoável.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">8. Cancelamento</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong>8.1. Pelo Cliente:</strong> O cliente pode cancelar mediante aviso prévio, sendo responsável pelos trabalhos já executados e materiais adquiridos.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>8.2. Pela Empresa:</strong> Reservamo-nos o direito de cancelar em caso de incumprimento contratual pelo cliente.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">9. Propriedade Intelectual</h3>
              <p className="text-muted-foreground leading-relaxed">
                Projetos, desenhos e documentação técnica permanecem propriedade da RC Construções até pagamento integral.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">10. Resolução de Conflitos</h3>
              <p className="text-muted-foreground leading-relaxed">
                Qualquer disputa será resolvida preferencialmente por acordo amigável. Caso não seja possível, 
                aplicam-se as leis portuguesas e a jurisdição dos tribunais portugueses.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">11. Contacto</h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                <p className="text-muted-foreground"><strong>Email:</strong> geral@rcconstrucoes.pt</p>
                <p className="text-muted-foreground"><strong>Telefone:</strong> +351 XXX XXX XXX</p>
              </div>
            </section>
          </div>
        </ScrollArea>
        
        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;
