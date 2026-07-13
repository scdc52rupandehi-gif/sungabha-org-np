import React from 'react';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getProjects() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
    );
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error || !data) throw new Error("Fallback");
    return data;
  } catch (e) {
    return [
      {
        id: "1",
        title: "Mental Health Awareness",
        description: "Reducing social discriminative behavior towards mental health affected people and providing access to government services.",
        featured_image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff50?q=80&w=1000&auto=format&fit=crop",
        status: "Active",
        location: "Rupandehi",
        slug: "mental-health-awareness"
      }
    ];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="pt-24 pb-16 min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
          Our Projects
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center max-w-2xl mx-auto mb-12">
          Explore our ongoing and completed projects making a lasting impact.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((p) => (
            <ProjectCard 
              key={p.id}
              id={p.id}
              title={p.title}
              excerpt={p.description?.substring(0, 100) + "..."}
              image={p.featured_image}
              status={p.status}
              location={p.location || "Nepal"}
              href={"/projects/" + (p.slug || p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
