import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, MapPin, User, ImageIcon, ChevronLeft, ChevronRight, ZoomIn, Play, Pause } from 'lucide-react';
import { ProjectWithImages } from '@/hooks/useProjects';
import { ImageLightbox } from '@/components/lightbox/ImageLightbox';
import { MetaTags } from '@/components/seo/MetaTags';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [slideshowSpeed, setSlideshowSpeed] = useState(4);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 300], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

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
    setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  };

  const handleMainImageClick = () => {
    setLightboxOpen(true);
  };

  const goToPrevious = () => {
    if (!project?.images.length) return;
    setDirection(-1);
    setSelectedIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  const goToNext = () => {
    if (!project?.images.length) return;
    setDirection(1);
    setSelectedIndex((prev) => (prev + 1) % project.images.length);
  };

  // Slideshow automático
  useEffect(() => {
    if (!isSlideshow || !project?.images.length) return;

    const timer = setInterval(() => {
      setDirection(1);
      setSelectedIndex((prev) => (prev + 1) % project.images.length);
    }, slideshowSpeed * 1000);

    return () => clearInterval(timer);
  }, [isSlideshow, slideshowSpeed, project?.images.length]);

  const toggleSlideshow = () => {
    setIsSlideshow(prev => !prev);
  };

  // Swipe handlers para mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrevious,
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: true,
  });

  // Variantes de animação para transição de imagens
  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  // Variantes para animações de entrada
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
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

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-20 overflow-hidden">
        <motion.div 
          className="container mx-auto px-4 max-w-7xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Botão Voltar */}
          <motion.div variants={itemVariants}>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="mb-8 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Projetos
            </Button>
          </motion.div>

          {/* Cabeçalho do Projeto com Parallax */}
          <motion.div
            style={{ y: headerY, opacity: headerOpacity }}
            className="mb-8"
          >
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-start justify-between gap-4 mb-4"
            >
              <div>
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-foreground mb-2"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
                >
                  {project.title}
                </motion.h1>
                {project.category && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Badge variant="secondary" className="text-sm">
                      {project.category}
                    </Badge>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 text-sm text-muted-foreground"
            >
              {project.city && (
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <MapPin className="h-4 w-4" />
                  <span>{project.city}</span>
                </motion.div>
              )}
              {project.client_name && (
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <User className="h-4 w-4" />
                  <span>{project.client_name}</span>
                </motion.div>
              )}
              {project.delivery_date && (
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Concluído em {formatDate(project.delivery_date)}</span>
                </motion.div>
              )}
            </motion.div>
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
                <Card className="overflow-hidden border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Galeria de Imagens ({project.images.length})
                    </CardTitle>
                    {project.images.length > 1 && (
                      <motion.button
                        onClick={toggleSlideshow}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                          isSlideshow 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSlideshow ? (
                          <>
                            <Pause className="h-4 w-4" />
                            <span className="hidden sm:inline">Pausar</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            <span className="hidden sm:inline">Slideshow</span>
                          </>
                        )}
                      </motion.button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Imagem Principal com Swipe */}
                    <div 
                      {...swipeHandlers}
                      className="relative aspect-video rounded-lg overflow-hidden group touch-pan-y"
                    >
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.img
                          key={selectedIndex}
                          custom={direction}
                          variants={imageVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          src={project.images[selectedIndex]?.url}
                          alt={project.images[selectedIndex]?.caption || `${project.title} - Imagem ${selectedIndex + 1}`}
                          className="w-full h-full object-cover cursor-pointer absolute inset-0"
                          onClick={handleMainImageClick}
                          draggable={false}
                        />
                      </AnimatePresence>
                      
                      {/* Overlay com ícone de zoom */}
                      <motion.div 
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center cursor-pointer z-10"
                        onClick={handleMainImageClick}
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <ZoomIn className="h-10 w-10 text-white drop-shadow-lg" />
                        </motion.div>
                      </motion.div>

                      {/* Botões de navegação */}
                      {project.images.length > 1 && (
                        <>
                          <motion.button
                            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20"
                            aria-label="Imagem anterior"
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.8)' }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </motion.button>
                          <motion.button
                            onClick={(e) => { e.stopPropagation(); goToNext(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20"
                            aria-label="Próxima imagem"
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.8)' }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <ChevronRight className="h-6 w-6" />
                          </motion.button>
                        </>
                      )}

                      {/* Contador de imagens */}
                      <motion.div 
                        className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full z-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {selectedIndex + 1} / {project.images.length}
                      </motion.div>

                      {/* Indicador de swipe para mobile */}
                      <motion.div 
                        className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        ← Deslize →
                      </motion.div>
                    </div>

                    {/* Legenda da imagem atual */}
                    <AnimatePresence mode="wait">
                      {project.images[selectedIndex]?.caption && (
                        <motion.p 
                          key={selectedIndex}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-center text-muted-foreground text-sm italic"
                        >
                          {project.images[selectedIndex].caption}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Miniaturas */}
                    {project.images.length > 1 && (
                      <motion.div 
                        className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {project.images.map((image, index) => (
                          <motion.button
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            onClick={() => handleThumbnailClick(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                              index === selectedIndex 
                                ? 'ring-2 ring-primary ring-offset-2 shadow-lg shadow-primary/20' 
                                : 'opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={image.caption || `Miniatura ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {index === selectedIndex && (
                              <motion.div
                                layoutId="thumbnail-indicator"
                                className="absolute inset-0 border-2 border-primary rounded-lg"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                              />
                            )}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}

                    {/* Dica de navegação */}
                    <motion.p 
                      className="text-center text-muted-foreground text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Use as setas ← → do teclado ou deslize para navegar
                    </motion.p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 bg-card/50">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma imagem disponível para este projeto</p>
                  </CardContent>
                </Card>
              )}

              {/* Descrição */}
              {project.description && (
                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full" />
                      Sobre o Projeto
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-lg">
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
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
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
              <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 border-0 shadow-lg shadow-primary/10 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <CardHeader className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CardTitle className="text-xl">Interessado em um projeto similar?</CardTitle>
                    <CardDescription className="text-base mt-2">
                      Entre em contato conosco para discutir seu projeto. Teremos o maior prazer em ajudá-lo a concretizar a sua visão.
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent className="relative">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="w-full text-lg py-6 font-semibold shadow-lg" 
                      size="lg"
                      onClick={() => {
                        navigate('/');
                        setTimeout(() => {
                          const contactSection = document.getElementById('contact');
                          if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 100);
                      }}
                    >
                      Solicitar Orçamento Gratuito
                    </Button>
                  </motion.div>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Resposta em até 24 horas úteis
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
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
