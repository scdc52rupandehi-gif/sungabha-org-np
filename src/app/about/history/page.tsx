import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { ShieldCheck, CalendarClock, Handshake, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'History & Profile | SCDC',
};

export default function Page() {
  return (
    <>
      <Hero 
        title="Profile & Legal Status" 
        subtitle="The foundation and history of Sungabha Community Development Center (SCDC)."
        backgroundImage="/Image/Past Achievements.png"
      />
      <Section className="py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border shadow-xl rounded-3xl p-10 md:p-14 relative overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck className="w-64 h-64 text-foreground" />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <CalendarClock className="w-6 h-6 text-brand-blue" />
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <strong className="text-foreground text-xl font-heading">Sungabha Community Development Center (SCDC)</strong> is a non-governmental, non-profit, non-political, and non-religious organization based in Rupandehi District, Nepal. The organization was legally registered with the District Administration Office (DAO), Rupandehi, on <strong className="text-foreground">28 September 1997</strong> under the Organization Registration Act and has been affiliated with the Social Welfare Council (SWC), Nepal, since 2007.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Handshake className="w-6 h-6 text-brand-green" />
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  SCDC is dedicated to improving the quality of life of marginalized, disadvantaged, and vulnerable communities through inclusive and sustainable development initiatives. The organization works in the areas of education, women's empowerment, disability inclusion, health promotion, livelihood development, and community capacity building.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Globe className="w-6 h-6 text-brand-blue" />
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  In collaboration with government agencies, development partners, and national and international organizations, SCDC designs and implements community-based programs that promote social inclusion, economic empowerment, improved access to essential services, and community resilience.
                </p>
              </div>

              <div className="w-full h-px bg-border/60 my-8" />
              
              <blockquote className="border-l-4 border-brand-green pl-6 italic text-xl text-foreground font-medium leading-relaxed">
                "Guided by the principles of transparency, accountability, participation, gender equality, and sustainability, SCDC envisions an inclusive, equitable, and self-reliant society where every individual can live with dignity and realize their full potential."
              </blockquote>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
