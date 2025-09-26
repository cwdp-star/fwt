import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Upload, 
  MessageSquare, 
  Settings, 
  Download,
  FileText,
  Users,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const QuickActions = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleExportData = async (type: 'quotes' | 'media') => {
    try {
      setLoading(type);
      
      if (type === 'quotes') {
        const { data, error } = await supabase
          .from('quote_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Convert to CSV
        if (data && data.length > 0) {
          const headers = Object.keys(data[0]).join(',');
          const rows = data.map(row => 
            Object.values(row).map(value => 
              typeof value === 'string' && value.includes(',') 
                ? `"${value}"` 
                : value
            ).join(',')
          ).join('\n');
          
          const csv = `${headers}\n${rows}`;
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `cotacoes_${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          toast({
            title: "Exportação Concluída",
            description: "Dados de cotações exportados com sucesso",
          });
        } else {
          toast({
            title: "Sem Dados",
            description: "Não há cotações para exportar",
            variant: "destructive",
          });
        }
      } else if (type === 'media') {
        const { data, error } = await supabase
          .from('media_files')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const headers = Object.keys(data[0]).join(',');
          const rows = data.map(row => 
            Object.values(row).map(value => 
              typeof value === 'string' && value.includes(',') 
                ? `"${value}"` 
                : value
            ).join(',')
          ).join('\n');
          
          const csv = `${headers}\n${rows}`;
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `arquivos_midia_${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          toast({
            title: "Exportação Concluída",
            description: "Lista de arquivos de mídia exportada com sucesso",
          });
        }
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: "Erro na Exportação",
        description: "Erro ao exportar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const quickActions = [
    {
      icon: Upload,
      title: "Upload de Mídia",
      description: "Adicionar novas imagens",
      action: () => {
        // Scroll to media tab
        const mediaTab = document.querySelector('[data-value="media"]');
        if (mediaTab) {
          (mediaTab as HTMLElement).click();
        }
      },
      color: "bg-blue-500",
      badge: "Mídia"
    },
    {
      icon: MessageSquare,
      title: "Ver Cotações",
      description: "Gerenciar pedidos de cotação",
      action: () => {
        const quotesTab = document.querySelector('[data-value="quotes"]');
        if (quotesTab) {
          (quotesTab as HTMLElement).click();
        }
      },
      color: "bg-green-500",
      badge: "Cotações"
    },
    {
      icon: Download,
      title: "Exportar Cotações",
      description: "Download dos dados em CSV",
      action: () => handleExportData('quotes'),
      color: "bg-purple-500",
      badge: "Exportar",
      loading: loading === 'quotes'
    },
    {
      icon: FileText,
      title: "Exportar Mídia",
      description: "Lista de arquivos em CSV",
      action: () => handleExportData('media'),
      color: "bg-orange-500",
      badge: "Relatório",
      loading: loading === 'media'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-primary/20">
                <CardContent className="p-4">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-0 flex flex-col items-start text-left"
                    onClick={action.action}
                    disabled={action.loading}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {action.badge}
                      </Badge>
                    </div>
                    <div className="w-full">
                      <h4 className="font-medium text-sm text-foreground mb-1">
                        {action.loading ? 'Processando...' : action.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;