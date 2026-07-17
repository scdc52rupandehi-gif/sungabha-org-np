"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Search, Heart } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { 
      name: 'Who We Are', 
      href: '#',
      dropdown: [
        { name: 'History', href: '/about/history' },
        { name: 'Mission', href: '/about/mission' },
        { name: 'Vision', href: '/about/vision' },
        { name: 'Objectives', href: '/about/objectives' },
        { name: 'Executive Committee', href: '/about/executive-committee' },
        { name: 'Staff Members', href: '/about/staff' },
        { name: 'Org Structure', href: '/about/structure' },
        { name: 'Our Partners', href: '/about/partners' },
      ]
    },
    { 
      name: 'Core Program Areas', 
      href: '#',
      dropdown: [
        { name: 'Projects', href: '/projects' },
      ]
    },
    { 
      name: 'Media', 
      href: '#',
      dropdown: [
        { name: 'News', href: '/news' },
        { name: 'Events', href: '/events' },
        { name: 'Photo Gallery', href: '/gallery/photos' },
        { name: 'Video Gallery', href: '/gallery/videos' },
        { name: 'Success Stories', href: '/success-stories' },
      ]
    },
    { 
      name: 'Resources', 
      href: '#',
      dropdown: [
        { name: 'Publications', href: '/publication' },
        { name: 'Notices', href: '/notice' },
        { name: 'Newsletters', href: '/newsletter' },
        { name: 'Tenders', href: '/tender' },
      ]
    },
    { name: 'Whistleblower', href: '/whistleblower' },
    { name: 'Contact', href: '/contact' }
  ];

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl shadow-sm py-4 border-b border-border' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 flex justify-between items-center gap-6 lg:gap-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-50 group -ml-2 lg:-ml-6">
          <motion.div whileHover={{ scale: 1.05 }} className="relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0">
            <Image src="/Logo.png" alt="SCDC Logo" fill className="object-contain" />
          </motion.div>
          <div className="flex flex-col justify-center">
            <span className={`font-heading font-black text-2xl lg:text-3xl leading-none tracking-tight whitespace-nowrap ${isScrolled ? 'text-brand-blue' : 'text-white drop-shadow-md'}`}>
              SUNGABHA
            </span>
            <span className={`text-[10px] lg:text-[12px] uppercase font-bold tracking-wider hidden sm:block mt-1 leading-tight max-w-[200px] lg:max-w-[250px] ${isScrolled ? 'text-foreground' : 'text-white/90'}`}>
              Community Development Centre
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <div 
              key={link.name}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {link.dropdown ? (
                <button 
                  className={`flex items-center gap-1 whitespace-nowrap font-semibold text-sm px-4 py-2 rounded-full transition-all ${
                    isScrolled 
                      ? 'text-foreground/80 hover:text-brand-blue hover:bg-brand-blue/5' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                  <ChevronDown className={`transition-transform duration-200 w-4 h-4 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link 
                  href={link.href}
                  className={`flex items-center gap-1 whitespace-nowrap font-semibold text-sm px-4 py-2 rounded-full transition-all ${
                    isScrolled 
                      ? 'text-foreground/80 hover:text-brand-blue hover:bg-brand-blue/5' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              )}
              
              {/* Mega Menu / Dropdown */}
              {link.dropdown && (
                <AnimatePresence>
                  {activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border overflow-hidden z-50 p-2"
                    >
                      <div className="flex flex-col gap-1">
                        {link.dropdown.map((dropItem) => (
                          <Link
                            key={dropItem.name}
                            href={dropItem.href}
                            className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all"
                          >
                            {dropItem.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          
          <Link href="/volunteer" className={`px-5 py-2 rounded-full font-semibold text-sm transition-all border ${
            isScrolled 
              ? 'border-border text-foreground hover:bg-accent hover:border-accent' 
              : 'border-white/30 text-white hover:bg-white/10'
          }`}>
            Volunteer
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/donate" className="relative group flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-brand-blue via-[#0ea5e9] to-brand-cyan bg-[length:200%_auto] hover:bg-right text-white px-7 py-3 rounded-full font-extrabold text-[15px] shadow-[0_0_15px_rgba(2,132,199,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] transition-all duration-500 border border-white/20">
              <span className="drop-shadow-md tracking-wide">Donate Now</span>
              <Heart className="w-[18px] h-[18px] fill-white text-white animate-pulse drop-shadow-md" />
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <ThemeToggle />
          <button 
            className={`p-2 relative z-50 rounded-full transition-colors ${isScrolled || isMobileMenuOpen ? 'text-foreground hover:bg-accent' : 'text-white hover:bg-white/10'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/95 backdrop-blur-2xl z-40 pt-28 px-6 pb-6 overflow-y-auto"
            >
              <div className="flex flex-col gap-6 max-w-sm mx-auto">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.dropdown ? (
                       <div className="text-xl font-heading font-bold text-foreground block py-2 border-b border-border/50">
                          {link.name}
                       </div>
                    ) : (
                      <Link 
                        href={link.href}
                        className="text-xl font-heading font-bold text-foreground block py-2 border-b border-border/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                    
                    {link.dropdown && (
                      <div className="pl-4 py-3 flex flex-col gap-4">
                        {link.dropdown.map(drop => (
                          <Link 
                            key={drop.name} 
                            href={drop.href}
                            className="text-base font-medium text-muted-foreground hover:text-brand-blue transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {drop.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="mt-8 flex flex-col gap-4">
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/donate" className="bg-gradient-to-r from-brand-blue via-[#0ea5e9] to-brand-cyan text-white text-center py-4 rounded-2xl font-extrabold text-lg shadow-[0_0_20px_rgba(2,132,199,0.5)] border border-white/20 tracking-wide">Donate Now</Link>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/volunteer" className="bg-accent text-accent-foreground text-center py-4 rounded-2xl font-bold text-lg border border-border">Become a Volunteer</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

