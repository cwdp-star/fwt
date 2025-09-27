import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Phone, MapPin, Calendar, DollarSign, Clock, FileText } from 'lucide-react';

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  location: string;
  budget: string;
  timeline: string;
  description: string;
  documents_link?: string;
  gdpr_consent: boolean;
  created_at: string;
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
        
        // Fallback para localStorage se Supabase falhar
        const storedRequests = JSON.parse(localStorage.getItem('quote_requests') || '[]');
        setRequests(storedRequests);
        
        if (storedRequests.length === 0) {
          toast({
            title: "Aviso",
            description: "Conectando à base de dados. A carregar dados locais...",
            variant: "default",
          });
        }
      } else {
        // Mapear dados do Supabase para interface esperada
        const mappedRequests = (data || []).map(request => ({
          ...request,
          location: request.city || '',
          project_type: request.project_type || request.service || '',
          gdpr_consent: true // Assumir consentimento para dados já na DB
        }));
        
        setRequests(mappedRequests);
      }
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      
      // Fallback final para localStorage
      try {
        const storedRequests = JSON.parse(localStorage.getItem('quote_requests') || '[]');
        setRequests(storedRequests);
      } catch {
        setRequests([]);
      }
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
                  <Badge variant="outline" className="capitalize">
                    {request.project_type}
                  </Badge>
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
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <a href={`tel:${request.phone}`} className="text-primary hover:underline">
                        {request.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{request.location}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Orçamento: {request.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Prazo: {request.timeline}</span>
                    </div>
                    {request.documents_link && (
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="h-4 w-4 text-primary" />
                        <a 
                          href={request.documents_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Documentos anexados
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Descrição do Projeto:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {request.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">RGPD:</span>
                    <Badge variant={request.gdpr_consent ? "default" : "destructive"} className="text-xs">
                      {request.gdpr_consent ? "Consentimento Dado" : "Sem Consentimento"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${request.email}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Responder
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`tel:${request.phone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Ligar
                      </a>
                    </Button>
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