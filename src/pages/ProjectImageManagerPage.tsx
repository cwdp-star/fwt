import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageUploadManager } from '../components/admin/ImageUploadManager';

interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  date?: string;
  project_id: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  city: string;
  duration: string;
  start_date: string;
  end_date?: string;
  delivery_date: string;
  completion_deadline: string;
  description: string;
  cover_image: string;
  created_at?: string;
  updated_at?: string;
}

const ProjectImageManager = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchImages();
    }
  }, [projectId]);

  const fetchProject = async () => {
    if (!projectId) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o projeto",
        variant: "destructive",
      });
    }
  };

  const fetchImages = async () => {
    if (!projectId) return;

    try {
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagesUpdate = (updatedImages: ProjectImage[]) => {
    setImages(updatedImages);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-4">Projeto não encontrado</h1>
          <Button onClick={() => navigate('/admin')}>
            Voltar ao Painel de Administração
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Admin
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              Gestão de Imagens - {project.title}
            </h1>
            <p className="text-muted-foreground mt-2">
              Adicione até 20 imagens ao projeto
            </p>
          </div>
          
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {images.length}/20 imagens
          </Badge>
        </div>

        {/* Project Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informações do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Categoria:</span>
                <p className="text-foreground">{project.category}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Cidade:</span>
                <p className="text-foreground">{project.city}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Duração:</span>
                <p className="text-foreground">{project.duration}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Data de Início:</span>
                <p className="text-foreground">{project.start_date}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload Manager */}
        <Card>
          <CardHeader>
            <CardTitle>Galeria do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploadManager
              projectId={projectId!}
              images={images}
              onImagesUpdate={handleImagesUpdate}
              maxImages={20}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectImageManager;