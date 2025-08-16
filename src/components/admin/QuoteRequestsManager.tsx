import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, Mail, Phone, MapPin, DollarSign, Clock, FileText, Edit, Save, X } from 'lucide-react';

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
  status?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

const QuoteRequestsManager = () => {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ status: string; notes: string }>({ status: '', notes: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchQuoteRequests();
  }, []);

  const fetchQuoteRequests = async () => {
    try {
      // Try to fetch from localStorage (fallback until Supabase table is ready)
      const storedRequests = JSON.parse(localStorage.getItem('quote_requests') || '[]');
      
      // Add status and notes if not present
      const requestsWithStatus = storedRequests.map((req: any) => ({
        ...req,
        status: req.status || 'pending',
        notes: req.notes || ''
      }));
      
      setRequests(requestsWithStatus);
    } catch (error) {
      console.error('Error fetching quote requests:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as solicitações de orçamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string, notes: string) => {
    try {
      // Update in localStorage for now
      const storedRequests = JSON.parse(localStorage.getItem('quote_requests') || '[]');
      const updatedRequests = storedRequests.map((req: QuoteRequest) =>
        req.id === id 
          ? { ...req, status, notes, updated_at: new Date().toISOString() }
          : req
      );
      
      localStorage.setItem('quote_requests', JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
      
      setEditingId(null);
      toast({
        title: "Atualizado",
        description: "Status da solicitação atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a solicitação",
        variant: "destructive",
      });
    }
  };

  const startEditing = (request: QuoteRequest) => {
    setEditingId(request.id);
    setEditForm({
      status: request.status || 'pending',
      notes: request.notes || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ status: '', notes: '' });
  };

  const handleSave = (id: string) => {
    updateRequestStatus(id, editForm.status, editForm.notes);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'contacted': return 'bg-blue-500';
      case 'quoted': return 'bg-purple-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'contacted': return 'Contactado';
      case 'quoted': return 'Orçamentado';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'completed': return 'Concluído';
      default: return 'Pendente';
    }
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
        <h2 className="text-2xl font-bold">Gestão de Orçamentos</h2>
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
                    {request.updated_at && (
                      <p className="text-xs text-muted-foreground">
                        Atualizado em {formatDate(request.updated_at)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {request.project_type}
                    </Badge>
                    <Badge className={`${getStatusColor(request.status || 'pending')} text-white`}>
                      {getStatusLabel(request.status || 'pending')}
                    </Badge>
                  </div>
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

                {/* Status Management */}
                <div className="border-t pt-4 space-y-4">
                  {editingId === request.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Status</label>
                          <Select
                            value={editForm.status}
                            onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="contacted">Contactado</SelectItem>
                              <SelectItem value="quoted">Orçamentado</SelectItem>
                              <SelectItem value="approved">Aprovado</SelectItem>
                              <SelectItem value="rejected">Rejeitado</SelectItem>
                              <SelectItem value="completed">Concluído</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Notas Internas</label>
                        <Textarea
                          value={editForm.notes}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          placeholder="Adicione notas sobre esta solicitação..."
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(request.id)}>
                          <Save className="h-4 w-4 mr-1" />
                          Guardar
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditing}>
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {request.notes && (
                        <div>
                          <h5 className="font-medium text-sm">Notas:</h5>
                          <p className="text-sm text-muted-foreground">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">RGPD:</span>
                    <Badge variant={request.gdpr_consent ? "default" : "destructive"} className="text-xs">
                      {request.gdpr_consent ? "Consentimento Dado" : "Sem Consentimento"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {editingId !== request.id && (
                      <Button size="sm" variant="outline" onClick={() => startEditing(request)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    )}
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

export default QuoteRequestsManager;