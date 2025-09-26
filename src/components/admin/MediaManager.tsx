import { useEffect, useState } from 'react';
import { Search, Grid, List, Trash2, Edit, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMediaManager } from '@/hooks/useMediaManager';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import MediaUploader from './MediaUploader';
import AdvancedFilters from './AdvancedFilters';
import { ImageLightbox } from '@/components/lightbox/ImageLightbox';

const MediaManager = () => {
  const { 
    mediaFiles, 
    loading, 
    uploadProgress, 
    fetchMediaFiles, 
    uploadFiles, 
    deleteFile, 
    updateFile 
  } = useMediaManager();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{id: string, url: string, caption?: string, project_id: string}[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Advanced search functionality
  const {
    filters,
    filteredAndSortedItems: filteredFiles,
    updateFilters,
    resetFilters,
    getSearchStats,
    getAvailableCategories
  } = useAdvancedSearch(mediaFiles);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchMediaFiles();
  }, [fetchMediaFiles]);
    const imageData = filteredFiles.map((f) => ({
      id: f.id,
      url: f.url,
      caption: f.title || f.description,
      project_id: 'media'
    }));
    setLightboxImages(imageData);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleNextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const handlePreviousImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const handleEditSave = async () => {
    if (editingFile) {
      await updateFile(editingFile.id, {
        title: editingFile.title,
        description: editingFile.description,
      });
      setEditingFile(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestão de Mídia</h2>
          <p className="text-muted-foreground">Gerir imagens e recursos do website</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {mediaFiles.length} arquivo(s)
        </Badge>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="gallery">Galeria</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Novas Imagens</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaUploader onUpload={uploadFiles} uploadProgress={uploadProgress} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          {/* Advanced Filters */}
          <AdvancedFilters
            filters={filters}
            onFiltersChange={updateFilters}
            onReset={resetFilters}
            categories={getAvailableCategories()}
            stats={getSearchStats()}
          />

          {/* View Mode Toggle */}
          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Media Gallery */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Carregando...</div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {getSearchStats().hasActiveFilters ? 'Nenhum arquivo encontrado com os filtros aplicados' : 'Nenhum arquivo enviado ainda'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-4'
            }>
              {filteredFiles.map((file, index) => (
                <Card key={file.id} className="overflow-hidden">
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={file.url}
                          alt={file.title || file.original_name}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => handleViewImage(file, index)}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-sm truncate" title={file.title || file.original_name}>
                          {file.title || file.original_name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(file.file_size)} • {formatDate(file.created_at)}
                        </p>
                        <div className="flex items-center gap-1 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewImage(file, index)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingFile(file)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir "{file.title || file.original_name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteFile(file)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={file.url}
                          alt={file.title || file.original_name}
                          className="w-16 h-16 object-cover rounded cursor-pointer"
                          onClick={() => handleViewImage(file, index)}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate" title={file.title || file.original_name}>
                            {file.title || file.original_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.file_size)} • {formatDate(file.created_at)}
                          </p>
                          {file.description && (
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                              {file.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewImage(file, index)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingFile(file)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir "{file.title || file.original_name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteFile(file)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      {editingFile && (
        <Dialog open={!!editingFile} onOpenChange={() => setEditingFile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Arquivo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={editingFile.title || ''}
                  onChange={(e) => setEditingFile({...editingFile, title: e.target.value})}
                  placeholder="Título da imagem"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={editingFile.description || ''}
                  onChange={(e) => setEditingFile({...editingFile, description: e.target.value})}
                  placeholder="Descrição da imagem"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingFile(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditSave}>
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
      />
    </div>
  );
};

export default MediaManager;