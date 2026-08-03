import React from 'react';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import { projectsData } from '@/data/projects';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function ProjectsPage() {
  const projects = projectsData;

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
              excerpt={(p.achievements?.[0] || "").substring(0, 100) + "..."}
              image={p.featured_image}
              status={p.status as "Completed" | "Active" | "Upcoming"}
              location={p.location || "Nepal"}
              href={"/projects/" + (p.slug || p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
