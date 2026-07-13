"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  location?: string;
  date?: string;
  href: string;
}

const ProjectCard = ({ id, title, excerpt, image, status, location, date, href }: ProjectCardProps) => {
  const statusColors = {
    'Active': 'bg-brand-green/10 text-brand-green border-brand-green/20',
    'Completed': 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
    'Upcoming': 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container with Blur Placeholder */}
      <div className="relative h-64 overflow-hidden w-full">
        <div className="absolute inset-0 bg-muted animate-pulse" />
        <Image 
          src={image} 
          alt={title}
          fill
          className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 left-4 z-10">
          <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm", statusColors[status])}>
            {status}
          </span>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="p-8 flex-1 flex flex-col relative bg-card">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-brand-blue" />
              <span>{location}</span>
            </div>
          )}
          {date && (
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-brand-blue" />
              <span>{date}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-heading font-bold text-foreground mb-4 line-clamp-2 leading-tight">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-8 line-clamp-3 flex-1 leading-relaxed">
          {excerpt}
        </p>
        
        <Link 
          href={href}
          className="inline-flex items-center gap-2 text-brand-blue font-bold hover:text-brand-cyan transition-colors group/link mt-auto"
        >
          View Project Details 
          <ArrowRight size={18} className="transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
