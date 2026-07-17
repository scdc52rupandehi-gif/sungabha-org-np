import React from 'react';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Image from 'next/image';

async function getProject(slug: string) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
    );
    const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
    if (error || !data) return null;
    return data;
  } catch (e) {
    return {
      id: "1",
      title: "Mental Health Awareness",
      description: "Reducing social discriminative behavior towards mental health affected people and providing access to government services.",
      featured_image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff50?q=80&w=1000&auto=format&fit=crop",
      status: "Active",
      location: "Rupandehi",
      slug: "mental-health-awareness"
    };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Not Found' };
  
  return {
    title: project.title + " | SCDC Projects",
    description: project.description?.substring(0, 160)
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-6 max-w-4xl">
        {project.featured_image && (
          <div className="w-full h-[400px] relative rounded-3xl overflow-hidden mb-8 shadow-lg">
            <Image 
              src={project.featured_image} 
              alt={project.title} 
              fill 
              className="object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-sm font-semibold">
            {project.status || "Active"}
          </span>
          <span className="text-zinc-500 text-sm">{project.location || "Nepal"}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-6">
          {project.title}
        </h1>
        
        <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{project.description}</p>
        </div>
      </div>
    </div>
  );
}
