"use client";

import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  src: string; // expecting a youtube ID or a youtube URL
  poster?: string;
  className?: string;
}

export default function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasRendered, setHasRendered] = useState(false);

  // Extract YouTube ID if a full URL is passed
  let videoId = src;
  if (src.includes("youtu.be/")) {
    videoId = src.split("youtu.be/")[1]?.split("?")[0];
  } else if (src.includes("youtube.com/watch")) {
    videoId = new URLSearchParams(src.split("?")[1]).get("v") || src;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRendered) {
          setHasRendered(true);
        }
      },
      { rootMargin: "200px" } // Load slightly before it comes into view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasRendered]);

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      {/* Fallback / Poster while not rendered */}
      {!hasRendered && poster && (
        <img 
          src={poster} 
          alt="Video Poster" 
          className="w-full h-full object-cover opacity-80"
        />
      )}
      
      {hasRendered ? (
        <iframe
          className="w-full h-full object-cover"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&controls=1&showinfo=0&modestbranding=1&rel=0`}
          title="SCDC Documentary"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl animate-pulse">
            <div className="w-0 h-0 border-t-[12px] md:border-t-[16px] border-t-transparent border-l-[20px] md:border-l-[24px] border-l-white border-b-[12px] md:border-b-[16px] border-b-transparent ml-2" />
          </div>
        </div>
      )}
    </div>
  );
}
