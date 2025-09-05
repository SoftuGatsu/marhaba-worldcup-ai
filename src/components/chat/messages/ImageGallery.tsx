import React, { useState } from 'react';
import { ImageGalleryPayload } from '@/types/api';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  payload: ImageGalleryPayload;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ payload }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % payload.images.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? payload.images.length - 1 : lightboxIndex - 1);
    }
  };

  return (
    <>
      <div className="chat-card">
        <div 
          className={`grid gap-3 ${
            payload.images.length === 1 
              ? 'grid-cols-1' 
              : payload.images.length === 2 
              ? 'grid-cols-2' 
              : 'grid-cols-2 md:grid-cols-3'
          }`}
        >
          {payload.images.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium">
                  View Full Size
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {payload.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={payload.images[lightboxIndex].url}
              alt={payload.images[lightboxIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
            <p className="text-white text-center mt-4 text-lg">
              {payload.images[lightboxIndex].alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
};