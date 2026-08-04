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
      name: "United Mission to Nepal",
      image: "/partners/partner-1.png",
      description: "SCDC implemented HIV/AIDS (2066-2072), Anti- Human Trafficking Project (2011-2013, 2017-2021), Mental Health Project (2019-2020), and Adolescent Sexual Reproductive Health Project (2019-2020)."
    },
    {
      id: 2,
      name: "Strømme Foundation",
      image: "/partners/partner-2.jpeg",
      description: "Strømme Foundation has been a Donor Partner for SCDC from 2014 and successfully completed ODW SAMVAD Program, Empowering adolescents- Dialogue Program of different Phase (2014 to 2022), SEEDS Program (2015-2017), and Mental Health and Well-being Project (2024-2026)."
    },
    {
      id: 3,
      name: "INF / PFR Pokhara",
      image: "/partners/partner-3.png",
      description: "Community Based Rehabilitation (CBR) for People with Disabilities (2065-2070). The CBR Project worked in advocating the rights of People with Disabilities and supported their capacity building and skill development to establish and strengthen Community based rehabilitation."
    },
    {
      id: 4,
      name: "World Vision International",
      image: "/partners/partner-4.png",
      description: "Education Project (2011-2015). Supported by World Vision Nepal, focused on strengthening the quality of education through capacity building of teachers and School Management Committees (SMCs). The project facilitated the formation and mobilization of Child Clubs to promote meaningful participation of children and supported the retrofitting of school buildings."
    },
    {
      id: 5,
      name: "Nepal Family Planning",
      image: "/partners/partner-5.jpeg",
      description: "Youth information programme in support of Nepal Family Planning Association of Nepal (2055-2060)."
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
            <div key={partner.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-8 items-center group">
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
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{partner.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
