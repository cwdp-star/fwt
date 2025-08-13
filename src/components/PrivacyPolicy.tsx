import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

const PrivacyPolicy = ({ onBack }: PrivacyPolicyProps) => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Política de Privacidade e Tratamento de Dados
            </CardTitle>
            <p className="text-center text-muted-foreground">
              RC Construções - Última atualização: {new Date().toLocaleDateString('pt-PT')}
            </p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold mb-4">1. Identificação da Entidade Responsável</h3>
                <p>
                  A RC Construções, com sede em Portugal, é a entidade responsável pelo tratamento dos seus dados pessoais, 
                  em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD) e a Lei Geral de Proteção de Dados (LGPD).
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">2. Dados Recolhidos</h3>
                <p>Recolhemos os seguintes dados pessoais através do formulário de contacto:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nome completo</li>
                  <li>Endereço de email</li>
                  <li>Número de telefone</li>
                  <li>Localização do projeto</li>
                  <li>Informações sobre o projeto pretendido</li>
                  <li>Documentos anexados voluntariamente</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">3. Finalidade do Tratamento</h3>
                <p>Os seus dados pessoais são tratados para as seguintes finalidades:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Resposta a pedidos de orçamento e contacto</li>
                  <li>Prestação de serviços de construção civil</li>
                  <li>Comunicação sobre projetos em curso</li>
                  <li>Cumprimento de obrigações legais</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">4. Base Legal</h3>
                <p>
                  O tratamento dos seus dados pessoais baseia-se no seu consentimento expresso, 
                  manifestado através da submissão do formulário de contacto e aceitação desta política de privacidade.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">5. Conservação dos Dados</h3>
                <p>
                  Os dados pessoais serão conservados pelo período necessário para a prestação dos serviços solicitados 
                  e cumprimento de obrigações legais, não excedendo 5 anos após o último contacto.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">6. Partilha de Dados</h3>
                <p>
                  Os seus dados pessoais não serão partilhados com terceiros, exceto quando necessário para a prestação 
                  dos serviços ou por exigência legal.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">7. Os Seus Direitos</h3>
                <p>Nos termos do RGPD e LGPD, tem o direito a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Aceder aos seus dados pessoais</li>
                  <li>Retificar dados incorretos ou incompletos</li>
                  <li>Apagar os seus dados pessoais</li>
                  <li>Limitar o tratamento dos seus dados</li>
                  <li>Portabilidade dos dados</li>
                  <li>Opor-se ao tratamento</li>
                  <li>Retirar o consentimento a qualquer momento</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">8. Cookies</h3>
                <p>
                  Este website utiliza cookies técnicos essenciais para o funcionamento do site. 
                  Não utilizamos cookies de marketing ou tracking sem o seu consentimento expresso.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">9. Segurança</h3>
                <p>
                  Implementamos medidas técnicas e organizacionais adequadas para proteger os seus dados pessoais 
                  contra acessos não autorizados, alteração, divulgação ou destruição.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">10. Contacto</h3>
                <p>
                  Para exercer os seus direitos ou esclarecer dúvidas sobre esta política de privacidade, 
                  contacte-nos através dos meios disponibilizados no nosso website.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">11. Reclamações</h3>
                <p>
                  Tem o direito de apresentar reclamação junto da Comissão Nacional de Proteção de Dados (CNPD) 
                  ou da Autoridade Nacional de Proteção de Dados (ANPD) do Brasil, conforme aplicável.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;