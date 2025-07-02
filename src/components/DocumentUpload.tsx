
import { ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import UploadedDocuments from './UploadedDocuments';

interface DocumentUploadProps {
  documents: File[];
  onDocumentsChange: (documents: File[]) => void;
}

const DocumentUpload = ({ documents, onDocumentsChange }: DocumentUploadProps) => {
  const { toast } = useToast();

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB max
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Alguns ficheiros foram rejeitados",
        description: "Apenas são aceites PDF, imagens, documentos Word e ficheiros de texto até 10MB.",
        variant: "destructive"
      });
    }

    onDocumentsChange([...documents, ...validFiles]);
  };

  const removeDocument = (index: number) => {
    onDocumentsChange(documents.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-2">
        Documentos (Opcional)
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
        <input
          type="file"
          id="documents"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
        />
        <label htmlFor="documents" className="cursor-pointer">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Clique para adicionar documentos
          </p>
          <p className="text-sm text-gray-500 mt-1">
            PDF, Imagens, Word, Texto (máx. 10MB cada)
          </p>
        </label>
      </div>

      <UploadedDocuments documents={documents} onRemove={removeDocument} />
    </div>
  );
};

export default DocumentUpload;
