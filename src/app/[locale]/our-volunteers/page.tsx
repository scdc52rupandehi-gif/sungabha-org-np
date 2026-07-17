import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Image from 'next/image';
import { MapPin, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Volunteers | SCDC',
  description: 'Meet the dedicated volunteers making a difference at Sungabha Community Development Centre.',
};

export default async function OurVolunteersPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  const { data: volunteers } = await supabase
    .from('volunteers')
    .select('*')
    .eq('status', 'Joined')
    .order('created_at', { ascending: true });

  return (
    <>
      <Hero 
        title="Our Volunteers" 
        subtitle="Meet the passionate individuals who dedicate their time and skills to empower our community."
        backgroundImage="https://images.unsplash.com/photo-1593113580332-ceb48508f7db?q=80&w=2070&auto=format&fit=crop"
      />
      <Section className="py-24 bg-zinc-50 dark:bg-zinc-950/50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {!volunteers || volunteers.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🌱</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Our Community is Growing</h3>
              <p className="text-muted-foreground max-w-md mx-auto">We are currently onboarding our amazing volunteers. Check back soon to meet our team!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {volunteers.map((vol) => (
                <div key={vol.id} className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-64 w-full bg-muted">
                    {vol.photo_url ? (
                      <Image 
                        src={vol.photo_url} 
                        alt={vol.full_name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-brand-blue/10">
                        <span className="text-4xl text-brand-blue/50 font-bold uppercase">{vol.full_name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{vol.full_name}</h3>
                      <div className="flex items-center gap-1.5 text-white/80 text-xs">
                        <MapPin size={12} /> {vol.district}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase size={16} className="text-brand-blue" />
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {vol.occupation || "Community Volunteer"}
                      </span>
                    </div>
                    
                    {vol.motivation && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-6 italic">
                        "{vol.motivation}"
                      </p>
                    )}

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {vol.skills?.slice(0, 3).map((skill: string) => (
                          <span key={skill} className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 px-2 py-1 rounded-md text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                        {vol.skills?.length > 3 && (
                          <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs font-medium">
                            +{vol.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
