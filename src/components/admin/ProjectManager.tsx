import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProjects, Project, ProjectImage } from '@/hooks/useProjects';

interface ProjectFormData {
  title: string;
  description: string;
  city: string;
  category: string;
  start_date: string;
  end_date: string;
  delivery_date: string;
}

const ProjectManager = () => {
  const { projects, loading, error, refreshProjects } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    city: '',
    category: '',
    start_date: '',
    end_date: '',
    delivery_date: ''
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      city: '',
      category: '',
      start_date: '',
      end_date: '',
      delivery_date: ''
    });
    setSelectedImages([]);
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
        setFormData({
          title: project.title,
          description: project.description || '',
          city: project.city || '',
          category: project.category || '',
          start_date: project.start_date || '',
          end_date: project.end_date || '',
          delivery_date: project.delivery_date || ''
        });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let projectId: string;

      if (editingProject) {
        // Update existing project
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            title: formData.title,
            description: formData.description,
            city: formData.city,
            category: formData.category,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            delivery_date: formData.delivery_date || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProject.id);

        if (updateError) throw updateError;
        projectId = editingProject.id;
        toast.success('Projeto atualizado com sucesso!');
      } else {
        // Create new project
        const { data: projectData, error: createError } = await supabase
          .from('projects')
          .insert({
            title: formData.title,
            description: formData.description,
            city: formData.city,
            category: formData.category,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            delivery_date: formData.delivery_date || null,
            status: 'active'
          })
          .select()
          .single();

        if (createError) throw createError;
        projectId = projectData.id;
        toast.success('Projeto criado com sucesso!');
      }

      // Upload images if any
      if (selectedImages.length > 0) {
        await uploadProjectImages(projectId);
      }

      refreshProjects();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      toast.error('Erro ao salvar projeto. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadProjectImages = async (projectId: string) => {
    const uploadPromises = selectedImages.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}_${Date.now()}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      // Save to project_images table
      const { error: insertError } = await supabase
        .from('project_images')
        .insert({
          project_id: projectId,
          url: publicUrl,
          caption: file.name
        });

      if (insertError) throw insertError;
    });

    await Promise.all(uploadPromises);
    toast.success(`${selectedImages.length} imagem(ns) adicionada(s) com sucesso!`);
  };

  const handleDelete = async (projectId: string, projectTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir o projeto "${projectTitle}"?`)) {
      return;
    }

    try {
      // Delete project images first (cascade should handle this, but let's be explicit)
      const { error: imagesError } = await supabase
        .from('project_images')
        .delete()
        .eq('project_id', projectId);

      if (imagesError) throw imagesError;

      // Delete project
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (projectError) throw projectError;

      toast.success('Projeto excluído com sucesso!');
      refreshProjects();
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Erro ao excluir projeto. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">Erro ao carregar projetos: {error}</p>
        <Button onClick={refreshProjects}>Tentar Novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestão de Projetos</h2>
          <p className="text-muted-foreground">Gerir projetos e suas imagens</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">Localização</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="ex: Residencial, Comercial"
                  />
                </div>
                
                <div>
                  <Label htmlFor="start_date">Data de Início</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="end_date">Data de Conclusão</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="delivery_date">Data de Entrega</Label>
                  <Input
                    id="delivery_date"
                    type="date"
                    value={formData.delivery_date}
                    onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="images">Imagens do Projeto</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedImages(Array.from(e.target.files || []))}
                />
                {selectedImages.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedImages.length} imagem(ns) selecionada(s)
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Salvando...' : editingProject ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-20">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum projeto encontrado</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {project.title}
                      <Badge variant="secondary">{project.images.length} fotos</Badge>
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {project.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {project.city}
                        </div>
                      )}
                      {project.end_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(project.end_date).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id, project.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {project.description && (
                <CardContent>
                  <p className="text-muted-foreground">{project.description}</p>
                  
                  {project.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {project.images.slice(0, 4).map((image, idx) => (
                        <div key={image.id} className="relative aspect-square">
                          <img
                            src={image.url}
                            alt={image.caption || project.title}
                            className="w-full h-full object-cover rounded"
                          />
                          {idx === 3 && project.images.length > 4 && (
                            <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center text-white text-sm">
                              +{project.images.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectManager;