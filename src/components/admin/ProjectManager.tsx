import { useState } from 'react';
import { Plus, Edit, Trash2, Image, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProjects, Project, ProjectImage } from '@/hooks/useProjects';
import ProjectImageGallery from './ProjectImageGallery';

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
  const { projects, loading, error, refreshProjects } = useProjects(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
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
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
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
    setImagePreviewUrls([]);
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
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsDialogOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
    
    // Generate preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(urls);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const toggleExpanded = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let projectId: string;

      if (editingProject) {
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
      const fileName = `${projectId}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('project_images')
        .insert({
          project_id: projectId,
          url: publicUrl,
          caption: file.name.replace(/\.[^/.]+$/, '')
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
      const { error: imagesError } = await supabase
        .from('project_images')
        .delete()
        .eq('project_id', projectId);

      if (imagesError) throw imagesError;

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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="images">Adicionar Imagens</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                />
                
                {/* Preview of selected images */}
                {imagePreviewUrls.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded border"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeSelectedImage(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
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

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-20">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum projeto encontrado</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Collapsible
              key={project.id}
              open={expandedProjects.has(project.id)}
              onOpenChange={() => toggleExpanded(project.id)}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CollapsibleTrigger className="flex-1 text-left">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {project.title}
                            <Badge variant="secondary">{project.images.length} fotos</Badge>
                            {project.category && (
                              <Badge variant="outline">{project.category}</Badge>
                            )}
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
                        {expandedProjects.has(project.id) ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(project);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id, project.title);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {project.description && (
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                    )}
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Galeria de Imagens ({project.images.length})
                      </h4>
                      <ProjectImageGallery
                        images={project.images}
                        projectTitle={project.title}
                        onImageDeleted={refreshProjects}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectManager;