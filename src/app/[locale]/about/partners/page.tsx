import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Partners',
};

export default function Page() {
  const partners = [
    {
      id: 1,
      name: "Stromme Foundation",
      image: "/partners/partner-1.jpeg",
      description: "Stromme Foundation has been a Donor Partner for SCDC from 2014 and Successfully completed ODW SAMVAD Program, Empowering adolescents- Dialogue Program of different Phase 2014 to 2022 SEEDS Program , 2015-2017. Mental Health and Well-being Project 2024-2026."
    },
    {
      id: 2,
      name: "Partner Organization",
      image: "/partners/partner-2.jpeg",
      description: "Collaborating with us to create a justice-able and equitable society through inclusive development initiatives."
    },
    {
      id: 3,
      name: "INF/ PFR Pokhara",
      image: "/partners/partner-3.jpeg",
      description: "CBR- People with Disabilities -Community Based Rehabilitation 2065-2070. CBR Project worked in advocating the rights of People with Disabilities and supported in their capacity building and skill development to establish and strengthened Community based rehabilitation."
    },
    {
      id: 4,
      name: "World Vision International",
      image: "/partners/partner-4.jpeg",
      description: "Education Project 2011-2015. The Education Project, supported by World Vision Nepal, focused on strengthening the quality of education through capacity building of teachers and School Management Committees (SMCs). The project also facilitated the formation and mobilization of Child Clubs to promote meaningful participation of children in school activities and decision-making. In addition, the project supported the retrofitting of school buildings to improve their safety and resilience."
    },
    {
      id: 5,
      name: "Nepal Family Planning",
      image: "/partners/partner-5.jpeg",
      description: "Youth information programme in support of Nepal Family Planning 2055-2060."
    }
  ];

  return (
    <>
      <Hero 
        title="Our Partners" 
        subtitle="Detailed information about Our Partners."
        backgroundImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
      />
      <Section className="py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-8 items-start group">
              <div className="w-full md:w-1/3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 flex items-center justify-center shrink-0 aspect-square group-hover:bg-brand-blue/5 transition-colors">
                <Image 
                  src={partner.image} 
                  alt={partner.name} 
                  width={200} 
                  height={200} 
                  className="object-contain max-h-32 w-auto mix-blend-multiply dark:mix-blend-normal" 
                />
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">{partner.name}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {partner.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
