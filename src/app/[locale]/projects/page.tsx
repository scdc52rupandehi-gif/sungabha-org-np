import React from 'react';
import ProjectCard from '@/components/ProjectCard';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const revalidate = 0; // Prevent caching to ensure fresh data

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  const { data: projects, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

  if (error) {
    console.error("Error loading projects:", error);
  }

  const projList = projects || [];

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
          {projList.map((p: any) => (
            <ProjectCard 
              key={p.id}
              id={p.id}
              title={p.title}
              excerpt={p.description || (p.achievements?.[0] || "").substring(0, 100) + "..."}
              image={p.featured_image || '/Image/default-placeholder.png'}
              status={p.status as "Completed" | "Active" | "Upcoming"}
              location={p.location || "Nepal"}
              href={"/projects/" + (p.slug || p.id)}
            />
          ))}
          {projList.length === 0 && <p className="text-center col-span-3 text-zinc-500 py-10">No projects found.</p>}
        </div>
      </div>
    </div>
  );
}
