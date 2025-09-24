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
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalImages: number;
  recentActivity: Activity[];
}

interface Activity {
  id: string;
  type: 'project_created' | 'project_updated' | 'image_upload';
  description: string;
  timestamp: Date;
  metadata?: any;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStatistics>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalImages: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch projects statistics
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, end_date, created_at, updated_at, title');

      if (projectsError) throw projectsError;

      const totalProjects = projects?.length || 0;
      const currentDate = new Date();
      const activeProjects = projects?.filter(p => 
        !p.end_date || new Date(p.end_date) > currentDate
      ).length || 0;
      const completedProjects = totalProjects - activeProjects;

      // Fetch images statistics
      const { data: images, error: imagesError } = await supabase
        .from('project_images')
        .select('id');

      if (imagesError) throw imagesError;

      // Generate recent activity
      const recentActivity: Activity[] = [
        ...(projects?.slice(0, 5).map(p => ({
          id: p.id,
          type: 'project_created' as const,
          description: `Projeto "${p.title}" foi criado`,
          timestamp: new Date(p.created_at),
        })) || []),
        ...(images?.slice(0, 3).map((img, index) => ({
          id: img.id,
          type: 'image_upload' as const,
          description: `Nova imagem foi adicionada à galeria`,
          timestamp: new Date(), // Since we don't have created_at for images in this context
        })) || [])
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 8);

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalImages: images?.length || 0,
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
      case 'project_created':
      case 'project_updated':
        return <Building className="h-4 w-4" />;
      case 'image_upload':
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

  const projectCompletionRate = stats.totalProjects > 0 
    ? Math.round((stats.completedProjects / stats.totalProjects) * 100)
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
                  <p className="text-sm font-medium text-muted-foreground">Total de Projetos</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">Ativos: {stats.activeProjects}</span>
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
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold">{projectCompletionRate}%</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4">
                <Progress value={projectCompletionRate} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.completedProjects} de {stats.totalProjects} concluídos
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
                  <p className="text-sm font-medium text-muted-foreground">Imagens na Galeria</p>
                  <p className="text-2xl font-bold">{stats.totalImages}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Projetos Ativos</p>
                  <p className="text-2xl font-bold">{stats.activeProjects}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  Em andamento
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