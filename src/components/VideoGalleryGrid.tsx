"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Play } from 'lucide-react';

export default function VideoGalleryGrid({ videos }: { videos: any[] }) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  const openLightbox = (url: string) => {
    let embedUrl = url;
    if (embedUrl.includes('youtube.com/watch?v=')) {
      embedUrl = embedUrl.replace('watch?v=', 'embed/').split('&')[0];
    } else if (embedUrl.includes('youtu.be/')) {
      embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
    }
    
    // Add autoplay
    if (embedUrl.includes('?')) {
      embedUrl += '&autoplay=1';
    } else {
      embedUrl += '?autoplay=1';
    }
    
    setSelectedVideoUrl(embedUrl);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedVideoUrl(null);
    document.body.style.overflow = 'auto';
  };

  // Helper to extract YouTube ID for thumbnail
  const getYouTubeId = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    return null;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((vid) => {
          const ytId = getYouTubeId(vid.video_url);
          const thumbnailUrl = ytId 
            ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
            : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop";

          return (
            <div 
              key={vid.id} 
              onClick={() => openLightbox(vid.video_url)}
              className="group overflow-hidden rounded-2xl shadow-sm border border-border bg-card hover:shadow-md transition-all cursor-pointer"
            >
              <div className="aspect-video relative overflow-hidden bg-muted flex items-center justify-center">
                <Image 
                  src={thumbnailUrl} 
                  alt={vid.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                
                {/* Play Button Icon */}
                <div className="relative z-20 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:bg-brand-blue group-hover:border-brand-blue transition-all duration-300">
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground truncate">{vid.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {selectedVideoUrl !== null && (
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

          {/* Main Video */}
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
             <iframe 
                src={selectedVideoUrl} 
                className="w-full h-full" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
