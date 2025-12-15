import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, MapPin, User, ImageIcon, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { ProjectWithImages } from '@/hooks/useProjects';
import { ImageLightbox } from '@/components/lightbox/ImageLightbox';
import { MetaTags } from '@/components/seo/MetaTags';
import { motion } from 'framer-motion';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior
    });
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Buscar projeto
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .single();

        if (projectError) throw projectError;
        if (!projectData) throw new Error('Projeto não encontrado');

        // Buscar imagens do projeto
        const { data: imagesData, error: imagesError } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', id)
          .order('created_at', { ascending: true });

        if (imagesError) throw imagesError;

        // Extrair nome do cliente
        let client_name = '';
        if (projectData.description) {
          const clientMatch = projectData.description.match(/Cliente:\s*([^\n\r\.]+)/i);
          if (clientMatch) {
            client_name = clientMatch[1].trim();
          }
        }

        setProject({
          ...projectData,
          images: imagesData || [],
          client_name: client_name || undefined
        });
      } catch (err) {
        console.error('Erro ao buscar projeto:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar projeto');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project?.images.length) return;
      
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev + 1) % project.images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project?.images.length]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não informada';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return 'Data inválida';
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleMainImageClick = () => {
    setLightboxOpen(true);
  };

  const goToPrevious = () => {
    if (!project?.images.length) return;
    setSelectedIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  const goToNext = () => {
    if (!project?.images.length) return;
    setSelectedIndex((prev) => (prev + 1) % project.images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-64 lg:col-span-2" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Erro ao carregar projeto</CardTitle>
              <CardDescription>{error || 'Projeto não encontrado'}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/')}>Voltar para a página inicial</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const pageTitle = `${project.title} - RC Construções`;
  
  // Create unique, descriptive meta description
  const createMetaDescription = () => {
    const parts = [];
    if (project.category) parts.push(`Projeto de ${project.category.toLowerCase()}`);
    if (project.city) parts.push(`em ${project.city}`);
    if (project.delivery_date) {
      const year = new Date(project.delivery_date).getFullYear();
      parts.push(`concluído em ${year}`);
    }
    
    let description = parts.join(' ');
    
    // Add description snippet if available
    if (project.description) {
      const cleanDesc = project.description
        .replace(/Cliente:.*?(\n|$)/gi, '')
        .trim()
        .substring(0, 100);
      description = `${description}. ${cleanDesc}`;
    }
    
    return description.length > 160 
      ? description.substring(0, 157) + '...' 
      : description;
  };
  
  const pageDescription = createMetaDescription();

  return (
    <>
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        ogImage={project.cover_image || project.images[0]?.url}
        canonical={`https://rcconstrucoes.pt/projects/${project.id}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Botão Voltar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="mb-8 hover:bg-primary/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Projetos
            </Button>
          </motion.div>

          {/* Cabeçalho do Projeto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {project.title}
                </h1>
                {project.category && (
                  <Badge variant="secondary" className="text-sm">
                    {project.category}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {project.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{project.city}</span>
                </div>
              )}
              {project.client_name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{project.client_name}</span>
                </div>
              )}
              {project.delivery_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Concluído em {formatDate(project.delivery_date)}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Conteúdo Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal - Galeria */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Galeria de Imagens */}
              {project.images.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Galeria de Imagens ({project.images.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Imagem Principal */}
                    <div className="relative aspect-video rounded-lg overflow-hidden group">
                      <motion.img
                        key={selectedIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        src={project.images[selectedIndex]?.url}
                        alt={project.images[selectedIndex]?.caption || `${project.title} - Imagem ${selectedIndex + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={handleMainImageClick}
                      />
                      
                      {/* Overlay com ícone de zoom */}
                      <div 
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center cursor-pointer"
                        onClick={handleMainImageClick}
                      >
                        <ZoomIn className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                      </div>

                      {/* Botões de navegação */}
                      {project.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            aria-label="Imagem anterior"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); goToNext(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            aria-label="Próxima imagem"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        </>
                      )}

                      {/* Contador de imagens */}
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                        {selectedIndex + 1} / {project.images.length}
                      </div>
                    </div>

                    {/* Legenda da imagem atual */}
                    {project.images[selectedIndex]?.caption && (
                      <p className="text-center text-muted-foreground text-sm italic">
                        {project.images[selectedIndex].caption}
                      </p>
                    )}

                    {/* Miniaturas */}
                    {project.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {project.images.map((image, index) => (
                          <motion.button
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            onClick={() => handleThumbnailClick(index)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                              index === selectedIndex 
                                ? 'ring-2 ring-primary ring-offset-2' 
                                : 'opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={image.caption || `Miniatura ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Dica de navegação */}
                    <p className="text-center text-muted-foreground text-xs">
                      Use as setas ← → do teclado para navegar
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma imagem disponível para este projeto</p>
                  </CardContent>
                </Card>
              )}

              {/* Descrição */}
              {project.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre o Projeto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Sidebar - Informações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Detalhes do Projeto */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Projeto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.start_date && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Data de Início</p>
                      <p className="text-foreground">{formatDate(project.start_date)}</p>
                    </div>
                  )}
                  {project.end_date && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Data de Conclusão</p>
                      <p className="text-foreground">{formatDate(project.end_date)}</p>
                    </div>
                  )}
                  {project.delivery_date && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Data de Entrega</p>
                      <p className="text-foreground">{formatDate(project.delivery_date)}</p>
                    </div>
                  )}
                  {project.city && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Localização</p>
                      <p className="text-foreground">{project.city}</p>
                    </div>
                  )}
                  {project.category && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Categoria</p>
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardHeader>
                  <CardTitle>Interessado em um projeto similar?</CardTitle>
                  <CardDescription>
                    Entre em contato conosco para discutir seu projeto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/#contact')}
                  >
                    Solicitar Orçamento
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {project.images.length > 0 && (
        <ImageLightbox
          images={project.images}
          currentIndex={selectedIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setSelectedIndex((prev) => (prev + 1) % project.images.length)}
          onPrevious={() => setSelectedIndex((prev) => (prev - 1 + project.images.length) % project.images.length)}
        />
      )}
    </>
  );
};

export default ProjectDetails;
