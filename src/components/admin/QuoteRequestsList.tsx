import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Clock, FileText } from 'lucide-react';

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const QuoteRequestsList = () => {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuoteRequests();
  }, []);

  const fetchQuoteRequests = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      setLoading(true);
      
      // Buscar orçamentos do Supabase
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      clearTimeout(timeoutId);

      if (error) {
        console.error('Erro ao buscar orçamentos:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar solicitações de orçamento.",
          variant: "destructive",
        });
        setRequests([]);
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Solicitações de Orçamento</h2>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {requests.length} solicitações
        </Badge>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-muted-foreground">
              As solicitações de orçamento aparecerão aqui quando forem recebidas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{request.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recebido em {formatDate(request.created_at)}
                    </p>
                  </div>
                  {request.service && (
                    <Badge variant="outline" className="capitalize">
                      {request.service}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <a href={`mailto:${request.email}`} className="text-primary hover:underline">
                        {request.email}
                      </a>
                    </div>
                    {request.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-primary" />
                        <a href={`tel:${request.phone}`} className="text-primary hover:underline">
                          {request.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {request.status && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Estado: {request.status}</span>
                      </div>
                    )}
                  </div>
                </div>

                {request.message && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Mensagem:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {request.message}
                    </p>
                  </div>
                )}

                {request.notes && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Notas:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {request.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end pt-4 border-t">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${request.email}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Responder
                      </a>
                    </Button>
                    {request.phone && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${request.phone}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          Ligar
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuoteRequestsList;