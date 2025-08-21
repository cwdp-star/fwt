import DatabaseHealthCheck from '@/components/DatabaseHealthCheck';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DatabaseHealthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verificação de Saúde da Base de Dados
          </h1>
          <p className="text-muted-foreground">
            Diagnóstico completo da conectividade e integridade dos dados do projeto
          </p>
        </div>

        <DatabaseHealthCheck />
      </div>
    </div>
  );
};

export default DatabaseHealthPage;