import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface HealthCheckResult {
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

const DatabaseHealthCheck = () => {
  const [results, setResults] = useState<HealthCheckResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runHealthCheck = async () => {
    setLoading(true);
    const checkResults: HealthCheckResult[] = [];

    try {
      // Test 1: Connection Test
      console.log('🔍 Iniciando verificação de saúde da base de dados...');
      
      try {
        const start = Date.now();
        const { data, error } = await supabase.from('projects').select('count').limit(1);
        const duration = Date.now() - start;
        
        if (error) {
          checkResults.push({
            status: 'error',
            message: 'Falha na conexão com Supabase',
            details: error
          });
        } else {
          checkResults.push({
            status: 'success',
            message: `Conexão bem-sucedida (${duration}ms)`,
            details: data
          });
        }
      } catch (err) {
        checkResults.push({
          status: 'error',
          message: 'Erro de rede ou configuração',
          details: err
        });
      }

      // Test 2: Projects Table Check
      try {
        const { data, error, count } = await supabase
          .from('projects')
          .select('*', { count: 'exact' });
          
        if (error) {
          checkResults.push({
            status: 'error',
            message: 'Erro ao acessar tabela projects',
            details: error
          });
        } else {
          checkResults.push({
            status: count && count > 0 ? 'success' : 'warning',
            message: `Tabela projects: ${count || 0} registos encontrados`,
            details: { count, sampleData: data?.slice(0, 2) }
          });
        }
      } catch (err) {
        checkResults.push({
          status: 'error',
          message: 'Falha ao consultar tabela projects',
          details: err
        });
      }

      // Test 3: Basic Table Structure Check
      try {
        const { data: tableInfo, error: tableError } = await supabase
          .from('projects')
          .select('id, title, category, cover_image')
          .limit(1);
          
        if (tableError) {
          checkResults.push({
            status: 'warning',
            message: 'Erro ao verificar estrutura da tabela',
            details: tableError
          });
        } else {
          checkResults.push({
            status: 'success',
            message: 'Estrutura da tabela verificada com sucesso',
            details: tableInfo
          });
        }
      } catch (err) {
        checkResults.push({
          status: 'warning',
          message: 'Verificação de estrutura não disponível',
          details: err
        });
      }

      // Test 4: Image URLs Check
      try {
        const { data: projectsWithImages } = await supabase
          .from('projects')
          .select('id, title, cover_image')
          .not('cover_image', 'is', null)
          .limit(3);

        const imageChecks = await Promise.all(
          (projectsWithImages || []).map(async (project) => {
            try {
              const response = await fetch(project.cover_image, { method: 'HEAD' });
              return {
                id: project.id,
                title: project.title,
                url: project.cover_image,
                accessible: response.ok
              };
            } catch {
              return {
                id: project.id,
                title: project.title,
                url: project.cover_image,
                accessible: false
              };
            }
          })
        );

        const accessibleImages = imageChecks.filter(img => img.accessible).length;
        const totalImages = imageChecks.length;

        checkResults.push({
          status: accessibleImages === totalImages ? 'success' : 'warning',
          message: `Imagens: ${accessibleImages}/${totalImages} acessíveis`,
          details: imageChecks
        });
      } catch (err) {
        checkResults.push({
          status: 'warning',
          message: 'Falha na verificação de imagens',
          details: err
        });
      }

    } catch (error) {
      checkResults.push({
        status: 'error',
        message: 'Erro geral na verificação',
        details: error
      });
    }

    console.log('📊 Resultados da verificação:', checkResults);
    setResults(checkResults);
    setLoading(false);
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Verificação de Saúde da Base de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runHealthCheck} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            'Executar Verificação'
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  result.status === 'success' ? 'bg-green-50 border-green-200' :
                  result.status === 'error' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(result.status)}
                  <span className="font-medium">{result.message}</span>
                </div>
                {result.details && (
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseHealthCheck;