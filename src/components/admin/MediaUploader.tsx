import { useCallback, useState } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MediaUploaderProps {
  onUpload: (files: FileList) => void;
  uploadProgress: { [key: string]: number };
}

const MediaUploader = ({ onUpload, uploadProgress }: MediaUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFiles = (files: FileList): { valid: File[], errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];
    const maxSize = 2 * 1024 * 1024; // 2MB

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Apenas imagens são permitidas`);
        return;
      }
      
      if (file.size > maxSize) {
        errors.push(`${file.name}: Arquivo muito grande (máx. 2MB)`);
        return;
      }
      
      valid.push(file);
    });

    return { valid, errors };
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const { valid, errors } = validateFiles(e.dataTransfer.files);
      setErrors(errors);
      if (valid.length > 0) {
        const dataTransfer = new DataTransfer();
        valid.forEach(file => dataTransfer.items.add(file));
        setSelectedFiles(valid);
        onUpload(dataTransfer.files);
      }
    }
  }, [onUpload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const { valid, errors } = validateFiles(e.target.files);
      setErrors(errors);
      if (valid.length > 0) {
        const dataTransfer = new DataTransfer();
        valid.forEach(file => dataTransfer.items.add(file));
        setSelectedFiles(valid);
        onUpload(dataTransfer.files);
      }
    }
  }, [onUpload]);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasActiveUploads = Object.keys(uploadProgress).length > 0;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
          }
          ${hasActiveUploads ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={hasActiveUploads}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="text-lg font-medium text-foreground">
              Arraste imagens aqui ou clique para selecionar
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Suporte para múltiplas imagens (máx. 2MB cada)
            </p>
          </div>
          <Button variant="outline" type="button" disabled={hasActiveUploads}>
            Selecionar Arquivos
          </Button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {Object.entries(uploadProgress).map(([fileId, progress]) => (
        <div key={fileId} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Enviando...</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      ))}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && Object.keys(uploadProgress).length === 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Arquivos Selecionados:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;