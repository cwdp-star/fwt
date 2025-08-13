import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  date?: string;
  project_id: string;
}

interface MasonryGridProps {
  images: ProjectImage[];
  onImageClick: (index: number) => void;
  columns?: number;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  images,
  onImageClick,
  columns = 3,
}) => {
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const [imagePositions, setImagePositions] = useState<{ x: number; y: number; width: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Calculate responsive columns
  const getResponsiveColumns = () => {
    if (typeof window === 'undefined') return columns;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    return Math.min(columns, 4);
  };

  const [responsiveColumns, setResponsiveColumns] = useState(getResponsiveColumns());

  useEffect(() => {
    const handleResize = () => {
      setResponsiveColumns(getResponsiveColumns());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);

  useEffect(() => {
    if (!containerRef.current || images.length === 0) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const gap = 16; // 1rem gap
    const columnWidth = (containerWidth - gap * (responsiveColumns - 1)) / responsiveColumns;

    // Initialize column heights
    const heights = new Array(responsiveColumns).fill(0);
    const positions: { x: number; y: number; width: number }[] = [];

    images.forEach((_, index) => {
      const imgElement = imageRefs.current[index];
      if (!imgElement) return;

      // Find the shortest column
      const shortestColumnIndex = heights.indexOf(Math.min(...heights));
      
      // Calculate image height based on aspect ratio
      const aspectRatio = imgElement.naturalHeight / imgElement.naturalWidth;
      const imageHeight = columnWidth * aspectRatio;

      // Position the image
      const x = shortestColumnIndex * (columnWidth + gap);
      const y = heights[shortestColumnIndex];

      positions[index] = { x, y, width: columnWidth };

      // Update column height
      heights[shortestColumnIndex] += imageHeight + gap;
    });

    setColumnHeights(heights);
    setImagePositions(positions);
  }, [images, responsiveColumns]);

  const containerHeight = Math.max(...columnHeights);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: containerHeight || 'auto' }}
    >
      {images.map((image, index) => {
        const position = imagePositions[index];
        if (!position) return null;

        return (
          <motion.div
            key={image.id}
            className="absolute cursor-pointer overflow-hidden rounded-lg bg-muted"
            style={{
              left: position.x,
              top: position.y,
              width: position.width,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onImageClick(index)}
          >
            <img
              ref={(el) => (imageRefs.current[index] = el)}
              src={image.url}
              alt={image.caption || `Imagem ${index + 1}`}
              className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            
            {/* Overlay with caption */}
            {image.caption && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium leading-tight">
                    {image.caption}
                  </p>
                </div>
              </div>
            )}

            {/* Loading placeholder */}
            <div className="absolute inset-0 bg-muted animate-pulse" />
          </motion.div>
        );
      })}
    </div>
  );
};