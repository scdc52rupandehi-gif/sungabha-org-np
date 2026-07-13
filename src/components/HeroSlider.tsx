"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface Slide {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

interface HeroSliderProps {
  slides: Slide[];
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

const HeroSlider = ({ 
  slides, 
  primaryAction, 
  secondaryAction
}: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-zinc-950">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${slides[currentSlide].backgroundImage}')` }}
        />
      </AnimatePresence>

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full pt-20">
        <div className="max-w-4xl min-h-[350px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-white font-heading font-bold mb-6 leading-[1.1] tracking-tight">
                {slides[currentSlide].title.split(' ').map((word, i, arr) => (
                  i === arr.length - 1 || i === arr.length - 2 ? (
                    <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">{word} </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                ))}
              </h1>
              
              <p className="text-lg md:text-2xl text-zinc-300 mb-10 max-w-2xl leading-relaxed font-medium">
                {slides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 mt-auto"
          >
            {primaryAction && (
              <Link 
                href={primaryAction.href} 
                className="group flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-cyan text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(2,132,199,0.4)] active:scale-95 transition-all"
              >
                {primaryAction.label}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            
            {secondaryAction && (
              <Link 
                href={secondaryAction.href} 
                className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 active:scale-95 transition-all"
              >
                {secondaryAction.label}
              </Link>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Slide Navigation Dots */}
      <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide 
                ? 'w-10 h-2.5 bg-brand-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)]' 
                : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-zinc-400 text-xs font-semibold tracking-widest uppercase">Scroll Down</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="text-zinc-400 w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSlider;
