
import { X } from 'lucide-react';

interface UploadedDocumentsProps {
  documents: File[];
  onRemove: (index: number) => void;
}

const UploadedDocuments = ({ documents, onRemove }: UploadedDocumentsProps) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word')) return '📝';
    return '📄';
  };

  if (documents.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium text-gray-700">Documentos anexados:</p>
      {documents.map((doc, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getFileIcon(doc.type)}</span>
            <div>
              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
              <p className="text-xs text-gray-500">{(doc.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default UploadedDocuments;
