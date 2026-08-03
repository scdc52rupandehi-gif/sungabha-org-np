import React from 'react';
import { notFound } from 'next/navigation';
import { projectsData } from '@/data/projects';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Target, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = projectsData.find(p => p.slug === resolvedParams.slug || p.id === resolvedParams.slug);
  
  if (!project) {
    notFound();
  }

  return (
    <>
      <Hero 
        title={project.title} 
        subtitle={`Partner: ${project.partner} | Status: ${project.status}`}
        backgroundImage={project.featured_image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"}
      />
      <Section className="py-24 bg-muted/30 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border shadow-xl rounded-3xl overflow-hidden">
            {project.featured_image && (
              <div className="relative w-full h-[400px]">
                <Image 
                  src={project.featured_image} 
                  alt={project.title} 
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-8 md:p-12">
              <div className="flex flex-wrap gap-4 mb-8">
                <span className="px-4 py-2 bg-brand-green/10 text-brand-green text-sm font-bold rounded-full border border-brand-green/20">
                  Partner: {project.partner}
                </span>
                <span className="px-4 py-2 bg-brand-blue/10 text-brand-blue text-sm font-bold rounded-full border border-brand-blue/20">
                  Duration: {project.duration}
                </span>
                <span className="px-4 py-2 bg-amber-500/10 text-amber-600 text-sm font-bold rounded-full border border-amber-500/20">
                  Status: {project.status}
                </span>
                <span className="px-4 py-2 bg-purple-500/10 text-purple-600 text-sm font-bold rounded-full border border-purple-500/20">
                  Location: {project.location}
                </span>
              </div>
              
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Major Interventions & Achievements</h3>
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
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
