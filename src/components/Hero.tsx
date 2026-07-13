"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  backgroundImage?: string;
}

const Hero = ({ 
  title, 
  subtitle, 
  badge, 
  primaryAction, 
  secondaryAction,
  backgroundImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
}: HeroProps) => {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background Image with Parallax */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full pt-20">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {badge && (
              <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(2,132,199,0.3)]">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                {badge}
              </div>
            )}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl text-white font-heading font-bold mb-6 leading-[1.1] tracking-tight"
          >
            {title.split(' ').map((word, i, arr) => (
              i === arr.length - 1 || i === arr.length - 2 ? (
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">{word} </span>
              ) : (
                <span key={i}>{word} </span>
              )
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-2xl text-zinc-300 mb-10 max-w-2xl leading-relaxed font-medium"
          >
            {subtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
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

export default Hero;
