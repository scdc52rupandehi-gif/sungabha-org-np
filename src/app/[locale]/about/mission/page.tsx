import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { Heart, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mission & Goal | SCDC',
};

export default function Page() {
  return (
    <>
      <Hero 
        title="Our Mission & Goal" 
        subtitle="Dedicated to building an inclusive and sustainable future."
        backgroundImage="/Image/Mission.png"
      />
      <Section className="py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="bg-card border border-border shadow-xl rounded-3xl p-10 md:p-16 text-center hover:shadow-2xl transition-all duration-300">
            <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-12 h-12 text-brand-green" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-brand-green uppercase tracking-widest mb-6">Our Mission</h2>
            <p className="text-2xl md:text-3xl font-medium text-foreground leading-snug">
              "To improve the quality of life of marginalized and vulnerable communities through inclusive, sustainable, and community-led development initiatives that promote equity, empowerment, and social justice."
            </p>
          </div>

          <div className="bg-card border border-border shadow-xl rounded-3xl p-10 md:p-16 text-center hover:shadow-2xl transition-all duration-300">
            <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Target className="w-12 h-12 text-brand-blue" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-brand-blue uppercase tracking-widest mb-6">Our Goal</h2>
            <p className="text-2xl md:text-3xl font-medium text-foreground leading-snug">
              "To bring the change in life of targeted groups."
            </p>
          </div>

        </div>
      </Section>
    </>
  );
}
