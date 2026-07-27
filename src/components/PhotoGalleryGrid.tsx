"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PhotoGalleryGrid({ images }: { images: any[] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img, index) => (
          <div 
            key={img.id} 
            onClick={() => openLightbox(index)}
            className="group overflow-hidden rounded-2xl shadow-sm border border-border bg-card hover:shadow-md transition-all cursor-pointer"
          >
            <div className="aspect-square relative overflow-hidden bg-muted">
              <Image 
                src={img.image_url} 
                alt={img.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground truncate">{img.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button 
            onClick={showPrev}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image 
              src={images[selectedImageIndex].image_url} 
              alt={images[selectedImageIndex].title} 
              fill
              className="object-contain animate-in zoom-in-95 duration-300"
            />
            {/* Title Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
              <p className="text-white text-lg md:text-xl font-medium">{images[selectedImageIndex].title}</p>
            </div>
          </div>

          {/* Next Button */}
          <button 
            onClick={showNext}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  );
}
