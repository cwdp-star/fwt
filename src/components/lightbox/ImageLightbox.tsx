import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  date?: string;
  project_id: string;
}

interface ImageLightboxProps {
  images: ProjectImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  title?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  title,
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState(3);
  const [direction, setDirection] = useState(0);

  const currentImage = images[currentIndex];

  // Reset zoom and position when image changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Slideshow auto-play
  useEffect(() => {
    if (!isPlaying || !isOpen) return;

    const timer = setInterval(() => {
      setDirection(1);
      onNext();
    }, slideshowInterval * 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isOpen, slideshowInterval, onNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setDirection(-1);
          onPrevious();
          break;
        case 'ArrowRight':
          setDirection(1);
          onNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.5, 1));
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  }, [handleZoomIn, handleZoomOut]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setDirection(1);
      onNext();
    },
    onSwipedRight: () => {
      setDirection(-1);
      onPrevious();
    },
    trackMouse: true,
    trackTouch: true,
  });

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    if (zoom === 1) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  }, [zoom, handleZoomIn, handleZoomOut]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      e.preventDefault();
    }
  }, [zoom]);

  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  }, [isDragging, zoom]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const imageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.15 },
      },
    }),
  };

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50"
        onClick={onClose}
      >
        {/* Backdrop with strong blur */}
        <motion.div
          initial={{ backdropFilter: 'blur(0px)' }}
          animate={{ backdropFilter: 'blur(20px)' }}
          exit={{ backdropFilter: 'blur(0px)' }}
          className="absolute inset-0 bg-black/90"
        />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white/90 font-medium"
            >
              {currentIndex + 1} / {images.length}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Main content */}
        <div
          {...swipeHandlers}
          className="flex items-center justify-center h-full p-4 pt-20 pb-32"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setDirection(-1);
                    onPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 w-12 h-12 rounded-full backdrop-blur-sm bg-black/30"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setDirection(1);
                    onNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 w-12 h-12 rounded-full backdrop-blur-sm bg-black/30"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </motion.div>
            </>
          )}

          {/* Image with AnimatePresence */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative max-w-full max-h-full overflow-hidden"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
              }}
              onWheel={handleWheel}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              <img
                src={currentImage.url}
                alt={currentImage.caption || `Imagem ${currentIndex + 1}`}
                className="max-w-[90vw] max-h-[70vh] object-contain select-none rounded-lg shadow-2xl"
                onClick={handleImageClick}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent"
        >
          <div className="max-w-2xl mx-auto space-y-3">
            {/* Caption */}
            <AnimatePresence mode="wait">
              {(title || currentImage.caption) && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center text-white"
                >
                  {title && <div className="font-semibold text-lg">{title}</div>}
                  {currentImage.caption && (
                    <div className="text-white/80 text-sm">{currentImage.caption}</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls row */}
            <div className="flex items-center justify-between gap-4">
              {/* Zoom controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  className="text-white hover:bg-white/10 h-8 w-8"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs text-white/60 min-w-10 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= 4}
                  className="text-white hover:bg-white/10 h-8 w-8"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Slideshow controls */}
              {images.length > 1 && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:bg-white/10 h-8 w-8"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">{slideshowInterval}s</span>
                    <Slider
                      value={[slideshowInterval]}
                      onValueChange={(value) => setSlideshowInterval(value[0])}
                      min={1}
                      max={10}
                      step={1}
                      className="w-20"
                    />
                  </div>
                </div>
              )}

              {/* Image counter (mobile) */}
              <div className="text-xs text-white/60 md:hidden">
                {currentIndex + 1}/{images.length}
              </div>
            </div>

            {/* Keyboard hints */}
            <div className="hidden md:flex justify-center gap-4 text-xs text-white/40">
              <span>← → Navegar</span>
              <span>Espaço: Play/Pause</span>
              <span>+/- Zoom</span>
              <span>Esc: Fechar</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};