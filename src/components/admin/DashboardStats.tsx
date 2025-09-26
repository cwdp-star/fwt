import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  MessageSquare, 
  Images, 
  TrendingUp, 
  Calendar,
  Users,
  Eye,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStatistics {
  totalMediaFiles: number;
  totalQuoteRequests: number;
  newQuoteRequests: number;
  recentQuoteRequests: number;
  recentActivity: Activity[];
}

interface Activity {
  id: string;
  type: 'quote_request' | 'media_upload' | 'quote_update';
  description: string;
  timestamp: Date;
  metadata?: any;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStatistics>({
    totalMediaFiles: 0,
    totalQuoteRequests: 0,
    newQuoteRequests: 0,
    recentQuoteRequests: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch media files statistics
      const { data: mediaFiles, error: mediaError } = await supabase
        .from('media_files')
        .select('id, created_at, title, original_name');

      if (mediaError) throw mediaError;

      // Fetch quote requests statistics
      const { data: quoteRequests, error: quotesError } = await supabase
        .from('quote_requests')
        .select('id, created_at, name, service, status, updated_at');

      if (quotesError) throw quotesError;

      const totalMediaFiles = mediaFiles?.length || 0;
      const totalQuoteRequests = quoteRequests?.length || 0;
      
      // Count new quote requests (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const newQuoteRequests = quoteRequests?.filter(q => 
        new Date(q.created_at) > weekAgo
      ).length || 0;
      
      // Count recent quote requests (last 30 days)
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const recentQuoteRequests = quoteRequests?.filter(q => 
        new Date(q.created_at) > monthAgo
      ).length || 0;

      // Generate recent activity
      const recentActivity: Activity[] = [
        ...(quoteRequests?.slice(0, 5).map(q => ({
          id: q.id,
          type: 'quote_request' as const,
          description: `Nova cotação de ${q.name} para ${q.service}`,
          timestamp: new Date(q.created_at),
        })) || []),
        ...(mediaFiles?.slice(0, 3).map((media) => ({
          id: media.id,
          type: 'media_upload' as const,
          description: `Nova mídia adicionada: ${media.title || media.original_name}`,
          timestamp: new Date(media.created_at),
        })) || [])
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 8);

      setStats({
        totalMediaFiles,
        totalQuoteRequests,
        newQuoteRequests,
        recentQuoteRequests,
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'quote_request':
        return <MessageSquare className="h-4 w-4" />;
      case 'quote_update':
        return <TrendingUp className="h-4 w-4" />;
      case 'media_upload':
        return <Images className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `há ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `há ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `há ${diffInDays} dia${diffInDays !== 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const quoteRequestsGrowth = stats.totalQuoteRequests > 0 
    ? Math.round((stats.newQuoteRequests / stats.totalQuoteRequests) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Cotações</p>
                  <p className="text-2xl font-bold">{stats.totalQuoteRequests}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">Novas (7 dias): {stats.newQuoteRequests}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Crescimento Mensal</p>
                  <p className="text-2xl font-bold">{quoteRequestsGrowth}%</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4">
                <Progress value={Math.min(quoteRequestsGrowth, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.recentQuoteRequests} cotações nos últimos 30 dias
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Arquivos de Mídia</p>
                  <p className="text-2xl font-bold">{stats.totalMediaFiles}</p>
                </div>
                <Images className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" />
                <span>Biblioteca centralizada</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cotações Recentes</p>
                  <p className="text-2xl font-bold">{stats.newQuoteRequests}</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  Últimos 7 dias
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 p-2 rounded-full bg-background">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma atividade recente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardStats;