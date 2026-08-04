import React from 'react';
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Target, CheckCircle2, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const revalidate = 0; // Disable caching

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .or(`slug.eq.${resolvedParams.slug},id.eq.${resolvedParams.slug}`)
    .single();
  
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
        <div className="max-w-5xl mx-auto space-y-12">
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
                  Partner: {project.partner || 'N/A'}
                </span>
                <span className="px-4 py-2 bg-brand-blue/10 text-brand-blue text-sm font-bold rounded-full border border-brand-blue/20">
                  Duration: {project.duration || 'N/A'}
                </span>
                <span className="px-4 py-2 bg-amber-500/10 text-amber-600 text-sm font-bold rounded-full border border-amber-500/20">
                  Status: {project.status || 'Active'}
                </span>
                <span className="px-4 py-2 bg-purple-500/10 text-purple-600 text-sm font-bold rounded-full border border-purple-500/20">
                  Location: {project.location || 'N/A'}
                </span>
              </div>
              
              {project.description && (
                <div className="mb-10 text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {project.description}
                </div>
              )}
              
              {project.achievements && project.achievements.length > 0 && (
                <div className="mb-10">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-brand-blue" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Major Interventions & Achievements</h3>
                  </div>
                  
                  <ul className="space-y-4">
                    {project.achievements.map((achievement: string, j: number) => (
                      <li key={j} className="flex gap-4 items-start">
                        <CheckCircle2 className="w-6 h-6 text-brand-green flex-shrink-0 mt-0.5" />
                        <span className="text-lg text-muted-foreground font-medium leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {project.images && project.images.length > 0 && (
            <div className="bg-card border border-border shadow-xl rounded-3xl overflow-hidden p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Project Gallery</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {project.images.map((img: string, i: number) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-border group hover:shadow-md transition-shadow">
                    <Image src={img} alt={`${project.title} gallery image ${i+1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </Section>
    </>
  );
}
