"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, ArrowRight, Heart } from 'lucide-react';

const Footer = () => {
  const pathname = usePathname();
  
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-background border-t border-border w-full relative z-10 pt-24 pb-12 overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent opacity-50" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Intro */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image src="/Logo.png" alt="SCDC Logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl leading-tight tracking-tight text-foreground">
                  SCDC
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Nepal
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground pr-4">
              Sungabha Community Development Centre (SCDC) is a non-governmental organization working towards a justice-able and equitable society by improving the livelihoods of marginalized communities.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-brand-blue hover:text-white transition-all font-bold text-xs">FB</a>
              <a href="#" aria-label="X (Twitter)" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all font-bold text-xs">X</a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-brand-orange hover:text-white transition-all font-bold text-xs">IG</a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-brand-blue hover:text-white transition-all font-bold text-xs">IN</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-foreground font-heading font-bold text-lg mb-6">Organization</h4>
            <ul className="space-y-4">
              <li><Link className="text-muted-foreground hover:text-brand-blue transition-all text-sm flex items-center gap-2 group" href="/about/history"><ArrowRight size={14} className="text-brand-blue/0 group-hover:text-brand-blue transition-all -ml-4 group-hover:ml-0" /> About SCDC</Link></li>
              <li><Link className="text-muted-foreground hover:text-brand-blue transition-all text-sm flex items-center gap-2 group" href="/projects/active"><ArrowRight size={14} className="text-brand-blue/0 group-hover:text-brand-blue transition-all -ml-4 group-hover:ml-0" /> Project Area</Link></li>
              <li><Link className="text-muted-foreground hover:text-brand-blue transition-all text-sm flex items-center gap-2 group" href="/about/partners"><ArrowRight size={14} className="text-brand-blue/0 group-hover:text-brand-blue transition-all -ml-4 group-hover:ml-0" /> Our Partners</Link></li>
              <li><Link className="text-muted-foreground hover:text-brand-blue transition-all text-sm flex items-center gap-2 group" href="/projects/completed"><ArrowRight size={14} className="text-brand-blue/0 group-hover:text-brand-blue transition-all -ml-4 group-hover:ml-0" /> Past Projects</Link></li>
              <li><Link className="text-muted-foreground hover:text-brand-blue transition-all text-sm flex items-center gap-2 group" href="/success-stories"><ArrowRight size={14} className="text-brand-blue/0 group-hover:text-brand-blue transition-all -ml-4 group-hover:ml-0" /> Success Stories</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-foreground font-heading font-bold text-lg mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link className="text-muted-foreground hover:text-brand-blue transition-all text-sm flex items-center gap-2 group" href="/publication"><ArrowRight size={14} className="text-brand-blue/0 group-hover:text-brand-blue transition-all -ml-4 group-hover:ml-0" /> Publications</Link></li>
              <li><Link className="text-muted-foreground hover:text-brand-blue transition-all text-sm flex items-center gap-2 group" href="/reports/annual"><ArrowRight size={14} className="text-brand-blue/0 group-hover:text-brand-blue transition-all -ml-4 group-hover:ml-0" /> Annual Reports</Link></li>
              <li><Link className="text-muted-foreground hover:text-brand-blue transition-all text-sm flex items-center gap-2 group" href="/notice"><ArrowRight size={14} className="text-brand-blue/0 group-hover:text-brand-blue transition-all -ml-4 group-hover:ml-0" /> Newsletters & Notices</Link></li>
              <li><Link className="text-muted-foreground hover:text-brand-blue transition-all text-sm flex items-center gap-2 group" href="/career"><ArrowRight size={14} className="text-brand-blue/0 group-hover:text-brand-blue transition-all -ml-4 group-hover:ml-0" /> Careers</Link></li>
              <li><Link className="text-muted-foreground hover:text-brand-blue transition-all text-sm flex items-center gap-2 group" href="/volunteer"><ArrowRight size={14} className="text-brand-blue/0 group-hover:text-brand-blue transition-all -ml-4 group-hover:ml-0" /> Volunteer</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-foreground font-heading font-bold text-lg mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="text-brand-blue shrink-0 mt-0.5" size={18} />
                <p className="text-sm">Kanchan-4, Sungabha Chowk, Rupandehi, Nepal</p>
              </div>
              <div className="flex items-start gap-3 text-muted-foreground">
                <Phone className="text-brand-blue shrink-0 mt-0.5" size={18} />
                <p className="text-sm">+977 984-1628280</p>
              </div>
              <div className="flex items-start gap-3 text-muted-foreground">
                <Mail className="text-brand-blue shrink-0 mt-0.5" size={18} />
                <p className="text-sm">scdc52rupandehi@gmail.com</p>
              </div>
            </div>
            <div className="pt-2">
              <Link className="inline-flex items-center justify-center gap-2 w-full bg-brand-blue/10 text-brand-blue px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-blue hover:text-white transition-all border border-brand-blue/20" href="/donate">
                Make a Donation <Heart size={16} className="fill-current" />
              </Link>
            </div>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            © {new Date().getFullYear()} Sungabha Community Development Centre.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
