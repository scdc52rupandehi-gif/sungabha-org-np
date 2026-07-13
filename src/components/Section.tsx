"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  dark?: boolean;
}

const Section = ({ id, title, subtitle, children, className, containerClassName, dark = false }: SectionProps) => {
  return (
    <section 
      id={id}
      className={cn(
        "py-24 md:py-32 relative overflow-hidden",
        dark ? "bg-zinc-950 text-white" : "bg-background text-foreground",
        className
      )}
    >
      {/* Optional decorative elements for dark sections */}
      {dark && (
        <>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", containerClassName)}>
        
        {(title || subtitle) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            {title && (
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6 leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn("text-lg md:text-xl font-medium", dark ? "text-zinc-400" : "text-muted-foreground")}>
                {subtitle}
              </p>
            )}
            {title && (
              <div className="w-24 h-1.5 bg-gradient-to-r from-brand-blue to-brand-cyan mx-auto mt-8 rounded-full" />
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
        
      </div>
    </section>
  );
};

export default Section;
