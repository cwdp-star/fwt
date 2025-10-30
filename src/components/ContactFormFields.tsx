import { ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Shield, Upload, X, FileText } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

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
  preferredStartDate?: string;
  gdprConsent: boolean;
}

interface UploadedFile {
  file: File;
  preview?: string;
}

interface ContactFormFieldsProps {
  formData: FormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onConsentChange: (checked: boolean) => void;
  onPrivacyClick: () => void;
  onSubmit: (e: React.FormEvent, files: File[]) => void;
  isSubmitting: boolean;
}

const ContactFormFields = ({ formData, onChange, onConsentChange, onPrivacyClick, onSubmit, isSubmitting }: ContactFormFieldsProps) => {
  const { getSettingValue } = useSiteSettings();
  const companyName = getSettingValue('company_name') || 'FTW Construções';
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;
    
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Pode enviar no máximo ${maxFiles} ficheiros`);
      return;
    }
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`${file.name} é muito grande. Máximo 10MB por ficheiro.`);
        return false;
      }
      return true;
    });
    
    const newFiles = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    const files = uploadedFiles.map(uf => uf.file);
    onSubmit(e, files);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
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

      {/* Preferred Start Date */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="preferredStartDate" className="block text-sm font-bold text-gray-800 mb-2">
            Data Preferencial de Início <span className="text-gray-500">(Opcional)</span>
          </label>
          <input
            type="date"
            id="preferredStartDate"
            name="preferredStartDate"
            value={formData.preferredStartDate || ''}
            onChange={onChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full min-h-[44px] px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
          />
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
            placeholder="https://drive.google.com/..."
            className="w-full min-h-[44px] px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
          />
        </div>
      </div>
      
      {/* File Upload Section */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Enviar Documentos/Fotos <span className="text-gray-500">(Opcional)</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
          <input
            type="file"
            id="fileUpload"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label 
            htmlFor="fileUpload" 
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <Upload className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Clique para enviar ou arraste ficheiros
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Imagens, PDF, Word (máx. 10MB por ficheiro, até 5 ficheiros)
              </p>
            </div>
          </label>
        </div>
        
        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((uploadedFile, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {uploadedFile.preview ? (
                  <img 
                    src={uploadedFile.preview} 
                    alt={`Pré-visualização ${index + 1}`}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <FileText className="w-12 h-12 text-primary p-2" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  aria-label="Remover ficheiro"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
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
              {' '}e consinto expressamente o tratamento dos meus dados pessoais pela {companyName} 
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

      <div className="text-center pt-6">
        <button
          type="submit"
          disabled={isSubmitting || !formData.gdprConsent}
          className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.4)] font-inter"
        >
          {isSubmitting ? 'A Enviar...' : 'Solicitar Orçamento Gratuito'}
        </button>
        <p className="text-sm text-muted-foreground mt-4 font-inter">
          * Campos obrigatórios. Responderemos em 24 horas.
        </p>
      </div>
    </form>
  );
};

export default ContactFormFields;
