import React from 'react';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getProjects(): Promise<any[]> {
  return [
    {
      id: "1",
      title: "HIV/AIDS Project",
      description: "5 VACC has been formed at local government level and are mobilized for prevention of HIV/AIDS. 76 HIV infected people have formed AWAZ Samuha at local level and transmission rate has been reduced by 51%.",
      featured_image: "/Image/Health%20%26%20Nutrition.png",
      status: "Completed",
      location: "Rupandehi",
      slug: "hiv-aids-project"
    },
    {
      id: "2",
      title: "Anti Human Trafficking",
      description: "396 families Benefitted from the Project. 7 Women groups formed and mobilized to fight against Human Trafficking alongside adolescent peer educators.",
      featured_image: "/Image/Women%20Empowerment.png",
      status: "Completed",
      location: "Rupandehi",
      slug: "anti-human-trafficking"
    },
    {
      id: "3",
      title: "Adolescents Sexual Reproductive Health",
      description: "550 families benefitted. ASRH groups formed and mobilized in 12 Schools. Adolescents girls' friendly school Health Corner supported.",
      featured_image: "/Image/Health%20%26%20Nutrition.png",
      status: "Completed",
      location: "Two Working Municipals",
      slug: "asrh-project"
    },
    {
      id: "4",
      title: "SEEDS/SAMVAD Education",
      description: "Re-enrolling dropped out adolescents, improving life skills, and preventing child marriages through youth forums and SATHEE networks.",
      featured_image: "/Image/Education%20Program.png",
      status: "Completed",
      location: "Kanchan Rural Municipal",
      slug: "seeds-samvad-project"
    },
    {
      id: "5",
      title: "Mental Health Project",
      description: "In total 209 mental health affected people are in recovering stage after receiving the treatment; Reduced social discriminative behavior.",
      featured_image: "/Image/Child%20Protection.png",
      status: "Completed",
      location: "Local Level",
      slug: "mental-health-project"
    }
  ];
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
