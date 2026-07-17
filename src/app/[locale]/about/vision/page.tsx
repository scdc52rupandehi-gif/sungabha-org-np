import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vision | SCDC',
};

export default function Page() {
  return (
    <>
      <Hero 
        title="Our Vision" 
        subtitle="The future we are working towards."
        backgroundImage="/Image/Vision.png"
      />
      <Section className="py-24 bg-muted/30 min-h-[50vh]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border shadow-xl rounded-3xl p-10 md:p-16 text-center hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 to-brand-green/5" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Target className="w-12 h-12 text-brand-blue" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-brand-blue uppercase tracking-widest mb-6">Our Vision</h2>
              <p className="text-3xl md:text-5xl font-medium text-foreground leading-snug">
                "Justice-able and equitable society"
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
