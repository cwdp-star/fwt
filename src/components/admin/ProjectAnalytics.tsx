import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Clock,
  BarChart3,
  PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectAnalytics {
  totalProjects: number;
  projectsByCategory: Record<string, number>;
  projectsByCity: Record<string, number>;
  projectsByMonth: Record<string, number>;
  averageDuration: number;
  completedProjects: number;
  upcomingDeadlines: number;
}

const ProjectAnalytics = () => {
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*');

      if (error) throw error;

      if (!projects) {
        setAnalytics(null);
        return;
      }

      // Calculate analytics
      const totalProjects = projects.length;
      
      // Group by category
      const projectsByCategory = projects.reduce((acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Group by city
      const projectsByCity = projects.reduce((acc, project) => {
        acc[project.city] = (acc[project.city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Group by month (created)
      const projectsByMonth = projects.reduce((acc, project) => {
        const month = new Date(project.created_at || '').toLocaleDateString('pt-PT', { 
          month: 'short', 
          year: 'numeric' 
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate average duration (parse duration strings)
      const durations = projects
        .map(p => parseInt(p.duration?.match(/\d+/)?.[0] || '0'))
        .filter(d => d > 0);
      const averageDuration = durations.length > 0 
        ? Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length)
        : 0;

      // Count completed projects (end_date is set)
      const completedProjects = projects.filter(p => p.end_date).length;

      // Count upcoming deadlines (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const upcomingDeadlines = projects.filter(p => {
        if (!p.completion_deadline) return false;
        const deadline = new Date(p.completion_deadline);
        return deadline <= thirtyDaysFromNow && deadline >= new Date();
      }).length;

      setAnalytics({
        totalProjects,
        projectsByCategory,
        projectsByCity,
        projectsByMonth,
        averageDuration,
        completedProjects,
        upcomingDeadlines
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sem Dados Disponíveis</h3>
          <p className="text-muted-foreground">
            Crie alguns projetos para ver as análises detalhadas.
          </p>
        </CardContent>
      </Card>
    );
  }

  const completionRate = analytics.totalProjects > 0 
    ? Math.round((analytics.completedProjects / analytics.totalProjects) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Projetos</p>
                  <p className="text-2xl font-bold">{analytics.totalProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                </div>
              </div>
              <Progress value={completionRate} className="mt-3" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duração Média</p>
                  <p className="text-2xl font-bold">{analytics.averageDuration}</p>
                  <p className="text-xs text-muted-foreground">dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prazos Próximos</p>
                  <p className="text-2xl font-bold">{analytics.upcomingDeadlines}</p>
                  <p className="text-xs text-muted-foreground">próximos 30 dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Projetos por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(analytics.projectsByCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => {
                  const percentage = Math.round((count / analytics.totalProjects) * 100);
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{count}</Badge>
                          <span className="text-sm text-muted-foreground">{percentage}%</span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects by City */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Projetos por Cidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(analytics.projectsByCity)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6) // Show top 6 cities
                .map(([city, count]) => {
                  const percentage = Math.round((count / analytics.totalProjects) * 100);
                  return (
                    <div key={city} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{city}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{count}</Badge>
                          <span className="text-sm text-muted-foreground">{percentage}%</span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Project Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Projetos por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(analytics.projectsByMonth)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .slice(-6) // Show last 6 months
                .map(([month, count]) => (
                  <div key={month} className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{count}</p>
                    <p className="text-sm text-muted-foreground">{month}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProjectAnalytics;