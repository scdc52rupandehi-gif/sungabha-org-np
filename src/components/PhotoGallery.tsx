"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';

const galleryImages = [
  { src: "/Photo Gallery/Child Protection.png", alt: "Child Protection", title: "Child Protection" },
  { src: "/Photo Gallery/Education Program.png", alt: "Education Program", title: "Education" },
  { src: "/Photo Gallery/Health & Nutrition.png", alt: "Health & Nutrition", title: "Health & Nutrition" },
  { src: "/Photo Gallery/WASH Program.png", alt: "WASH Program", title: "WASH Program" },
  { src: "/Photo Gallery/Women Empowerment.png", alt: "Women Empowerment", title: "Women Empowerment" },
  { src: "/Photo Gallery/Youth Leadership.png", alt: "Youth Leadership", title: "Youth Leadership" },
];

const PhotoCard = ({ image, index }: { image: typeof galleryImages[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position values for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation angle (max 12 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the card (-0.5 to 0.5)
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset rotation smoothly
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative aspect-[4/3] rounded-2xl cursor-pointer group"
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Glow effect behind the image based on hover */}
        <div className={`absolute inset-0 bg-brand-blue/30 blur-2xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* The Image */}
        <div 
          className={`relative w-full h-full transition-all duration-700 ease-out ${
            isHovered ? 'grayscale-0 scale-110' : 'grayscale opacity-70'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
          />
        </div>

        {/* Gradient Overlay & Text */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 flex items-end p-6 ${
            isHovered 
              ? 'bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-100' 
              : 'bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent opacity-80'
          }`}
        >
          <motion.div 
            className="w-full"
            style={{ translateZ: 50 }}
            animate={{ 
              y: isHovered ? -10 : 0,
            }}
          >
            <h3 className={`text-xl md:text-2xl font-bold font-heading transition-colors duration-300 drop-shadow-md ${
              isHovered ? 'text-brand-cyan' : 'text-white'
            }`}>
              {image.title}
            </h3>
            <div className={`h-1 w-12 rounded-full mt-2 transition-all duration-300 ${
              isHovered ? 'bg-brand-cyan w-24' : 'bg-brand-blue/50'
            }`} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function PhotoGallery() {
  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-blue/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-brand-cyan/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-cyan font-semibold text-sm mb-4"
          >
            Glimpses of Impact
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-black text-white mb-6"
          >
            Photo <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">Gallery</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg"
          >
            Hover over the images to bring our community initiatives to life.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((img, idx) => (
            <PhotoCard key={img.src} image={img} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
