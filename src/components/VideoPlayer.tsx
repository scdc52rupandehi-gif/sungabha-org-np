"use client";

import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          videoRef.current?.play().catch(e => {
            console.log("Autoplay prevented or video missing:", e);
            setHasError(true);
          });
        } else {
          setIsInView(false);
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 } // Play when 50% of the video is visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative group ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-opacity duration-700"
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Play Icon / Status overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none transition-all duration-500 group-hover:bg-black/50">
        {!isInView && !hasError && (
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl animate-pulse">
            <div className="w-0 h-0 border-t-[12px] md:border-t-[16px] border-t-transparent border-l-[20px] md:border-l-[24px] border-l-white border-b-[12px] md:border-b-[16px] border-b-transparent ml-2" />
          </div>
        )}
        {hasError && (
          <div className="text-white text-center">
            <p className="font-bold text-lg">Video Coming Soon</p>
            <p className="text-sm opacity-80">Documentary currently in production.</p>
          </div>
        )}
      </div>
    </div>
  );
}
