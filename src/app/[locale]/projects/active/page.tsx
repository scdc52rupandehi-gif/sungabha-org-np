import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { Target, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Active Projects | SCDC',
};

export default function Page() {
  const projects = [
    {
      title: "Mental Health and Well-being Project",
      partner: "Stromme Foundation",
      duration: "2024-Present",
      achievements: [
        "Conducted community awareness programmes on mental health.",
        "Organized capacity-building and training programmes.",
        "Mobilized Female Community Health Volunteers (FCHVs), teachers, and health workers.",
        "Provided psychosocial support and referral services.",
        "Supported income-generating activities for vulnerable individuals.",
        "Implemented the ICDP Positive Parenting Programme.",
        "Mobilized peer educators to promote mental health awareness and community support."
      ]
    }
  ];

  return (
    <>
      <Hero 
        title="Active Projects" 
        subtitle="Currently ongoing projects and initiatives."
        backgroundImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
      />
      <Section className="py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-12">
          {projects.map((project, i) => (
            <div key={i} className="bg-card border border-border shadow-md rounded-3xl p-8 md:p-10 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-7 h-7 text-brand-blue" />
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{project.title}</h2>
              </div>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-brand-green/10 text-brand-green text-sm font-semibold rounded-full border border-brand-green/20">
                  Partner: {project.partner}
                </span>
                <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-sm font-semibold rounded-full border border-brand-blue/20">
                  Duration: {project.duration}
                </span>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-sm font-semibold rounded-full border border-amber-500/20">
                  Status: Ongoing
                </span>
              </div>
              <ul className="space-y-4">
                {project.achievements.map((achievement, j) => (
                  <li key={j} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-muted-foreground font-medium leading-relaxed">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
