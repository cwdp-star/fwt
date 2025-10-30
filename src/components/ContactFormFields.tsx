import { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  budget: string;
  timeline: string;
  description: string;
  documentsLink?: string;
  gdprConsent: boolean;
}

interface ContactFormFieldsProps {
  formData: FormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onConsentChange: (checked: boolean) => void;
  onPrivacyClick: () => void;
}

const ContactFormFields = ({ formData, onChange, onConsentChange, onPrivacyClick }: ContactFormFieldsProps) => {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2">
            Nome Completo *
          </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={onChange}
              maxLength={100}
              pattern="[A-Za-zÀ-ÿ\s]+"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
              placeholder="O seu nome completo"
            />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
            Email *
          </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={onChange}
              maxLength={254}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
              placeholder="seuemail@exemplo.com"
            />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-2">
            Telefone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={onChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
            placeholder="+351 912 345 678"
          />
        </div>

        <div>
          <label htmlFor="projectType" className="block text-sm font-bold text-gray-800 mb-2">
            Tipo de Projeto *
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            value={formData.projectType}
            onChange={onChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
          >
            <option value="">Selecione o tipo</option>
            <option value="construcao-nova">Construção Nova</option>
            <option value="ampliacao">Ampliação</option>
            <option value="remodelacao">Remodelação</option>
            <option value="comercial">Projeto Comercial</option>
            <option value="industrial">Projeto Industrial</option>
            <option value="outros">Outros</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-bold text-gray-800 mb-2">
          Localização da Obra *
        </label>
        <input
          type="text"
          id="location"
          name="location"
          required
          value={formData.location}
          onChange={onChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
          placeholder="Cidade - Distrito"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="budget" className="block text-sm font-bold text-gray-800 mb-2">
            Orçamento Previsto
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={onChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
          >
            <option value="">Selecione a faixa</option>
            <option value="ate-25k">Até €25.000</option>
            <option value="25k-50k">€25.000 - €50.000</option>
            <option value="50k-100k">€50.000 - €100.000</option>
            <option value="100k-250k">€100.000 - €250.000</option>
            <option value="acima-250k">Acima de €250.000</option>
            <option value="nao-definido">Ainda não definido</option>
          </select>
        </div>

        <div>
          <label htmlFor="timeline" className="block text-sm font-bold text-gray-800 mb-2">
            Prazo Desejado
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={onChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
          >
            <option value="">Selecione o prazo</option>
            <option value="urgente">Urgente (até 1 mês)</option>
            <option value="rapido">Rápido (1-3 meses)</option>
            <option value="medio">Médio (3-6 meses)</option>
            <option value="longo">Longo (6-12 meses)</option>
            <option value="flexivel">Flexível</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-bold text-gray-800 mb-2">
          Descrição da Obra *
        </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={onChange}
              maxLength={2000}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none font-medium"
              placeholder="Descreva detalhes da sua obra, área, especificações, objetivos..."
            ></textarea>
      </div>

      {/* Documents Link Field */}
      <div>
        <label htmlFor="documentsLink" className="block text-sm font-bold text-gray-800 mb-2">
          Link para Documentos <span className="text-gray-500">(Opcional)</span>
        </label>
        <input
          id="documentsLink"
          name="documentsLink"
          type="url"
          value={formData.documentsLink || ''}
          onChange={onChange}
          placeholder="https://drive.google.com/... ou https://dropbox.com/..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
        />
        <p className="text-xs text-gray-600 mt-1">
          Pode partilhar um link para documentos, plantas ou imagens no Google Drive, Dropbox ou similar.
        </p>
      </div>

      {/* GDPR Consent */}
      <div className="space-y-4 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border-2 border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold text-gray-900">Proteção de Dados (RGPD)</h3>
        </div>
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="gdprConsent"
            checked={formData.gdprConsent}
            onCheckedChange={onConsentChange}
            className="mt-1"
            required
          />
          <div className="flex-1">
            <label 
              htmlFor="gdprConsent" 
              className="text-sm text-gray-800 cursor-pointer leading-relaxed font-medium"
            >
              Declaro que li e aceito a{' '}
              <button
                type="button"
                onClick={onPrivacyClick}
                className="text-primary underline hover:text-accent font-bold"
              >
                Política de Privacidade
              </button>
              {' '}e consinto expressamente o tratamento dos meus dados pessoais pela FTW Construções 
              para as seguintes finalidades: (i) resposta ao meu pedido de orçamento, (ii) contacto 
              comercial relacionado com o serviço solicitado. *
            </label>
          </div>
        </div>
        
        <div className="bg-white/50 p-3 rounded-lg">
          <p className="text-xs text-gray-700 leading-relaxed">
            <strong>Os seus direitos:</strong> Pode a qualquer momento exercer os seus direitos de acesso, 
            retificação, portabilidade, limitação, oposição e eliminação dos seus dados pessoais, 
            bem como retirar o consentimento, contactando-nos através do email ou telefone disponibilizados 
            no website. Os seus dados são armazenados de forma segura e não serão partilhados com terceiros 
            sem o seu consentimento explícito.
          </p>
        </div>
        
        <p className="text-xs text-gray-600 font-semibold">
          * Campo obrigatório nos termos do RGPD (Regulamento UE 2016/679)
        </p>
      </div>
    </>
  );
};

export default ContactFormFields;
