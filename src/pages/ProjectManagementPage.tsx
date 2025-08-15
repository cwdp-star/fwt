import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { ImageUploadManager } from '@/components/admin/ImageUploadManager';
import { Project } from '@/types/project';

interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  date?: string;
  project_id: string;
}

const ProjectManagementPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchImages();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o projeto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: project.title,
          category: project.category,
          city: project.city,
          duration: project.duration,
          start_date: project.start_date,
          end_date: project.end_date,
          delivery_date: project.delivery_date,
          completion_deadline: project.completion_deadline,
          description: project.description,
          cover_image: project.cover_image,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Projeto Atualizado",
        description: "As alterações foram guardadas com sucesso",
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Erro",
        description: "Não foi possível guardar as alterações",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImagesUpdate = (updatedImages: ProjectImage[]) => {
    setImages(updatedImages);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Projeto não encontrado</h1>
          <Button onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Painel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Painel
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              Gestão do Projeto
            </h1>
            <p className="text-muted-foreground">
              {project.title}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
            <TabsTrigger value="details">Dados do Projeto</TabsTrigger>
            <TabsTrigger value="gallery">Galeria ({images.length}/20)</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Editar Dados do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProject} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título do Projeto</Label>
                      <Input
                        id="title"
                        value={project.title}
                        onChange={(e) => setProject({ ...project, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select
                        value={project.category}
                        onValueChange={(value) => setProject({ ...project, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Residential">Residencial</SelectItem>
                          <SelectItem value="Commercial">Comercial</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                          <SelectItem value="Renovation">Renovação</SelectItem>
                          <SelectItem value="Infrastructure">Infraestrutura</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={project.city}
                        onChange={(e) => setProject({ ...project, city: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duração</Label>
                      <Input
                        id="duration"
                        value={project.duration}
                        onChange={(e) => setProject({ ...project, duration: e.target.value })}
                        placeholder="ex: 6 meses"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="start_date">Data de Início</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={project.start_date}
                        onChange={(e) => setProject({ ...project, start_date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date">Data de Fim</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={project.end_date || ''}
                        onChange={(e) => setProject({ ...project, end_date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delivery_date">Data de Entrega</Label>
                      <Input
                        id="delivery_date"
                        type="date"
                        value={project.delivery_date}
                        onChange={(e) => setProject({ ...project, delivery_date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="completion_deadline">Prazo de Conclusão</Label>
                      <Input
                        id="completion_deadline"
                        type="date"
                        value={project.completion_deadline}
                        onChange={(e) => setProject({ ...project, completion_deadline: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={project.description}
                      onChange={(e) => setProject({ ...project, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover_image">URL da Imagem de Capa</Label>
                    <Input
                      id="cover_image"
                      value={project.cover_image}
                      onChange={(e) => setProject({ ...project, cover_image: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={saving} className="w-full">
                    {saving ? 'Guardando...' : 'Guardar Alterações'}
                    <Save className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Gestão da Galeria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadManager
                  projectId={id!}
                  images={images}
                  onImagesUpdate={handleImagesUpdate}
                  maxImages={20}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectManagementPage;