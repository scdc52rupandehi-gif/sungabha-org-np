import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { UserCircle2 } from 'lucide-react';
import { getCommittee } from '@/app/actions/committee';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Executive Committee | SCDC',
};

export default async function Page() {
  const members = await getCommittee();

  return (
    <>
      <Hero 
        title="Executive Committee" 
        subtitle="Meet the dedicated board members guiding SCDC's vision and initiatives."
        backgroundImage="/Image/About SCDC.png"
      />
      <Section className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div key={member.id} className="bg-card border border-border shadow-md rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-40 h-40 relative rounded-full overflow-hidden mb-6 border-4 border-brand-blue/20 bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                  {member.image_url ? (
                    <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                  ) : (
                    <UserCircle2 className="w-20 h-20" />
                  )}
                </div>
                
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{member.name}</h3>
                <span className="inline-block px-4 py-1.5 bg-brand-green/10 text-brand-green text-sm font-bold uppercase tracking-wider rounded-full mb-4">
                  {member.role}
                </span>
                <div className="w-full h-px bg-border my-4" />
                <div className="w-full flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground font-medium">Experience</span>
                  <span className="font-semibold text-foreground">{member.experience}</span>
                </div>
                <div className="w-full flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Tenure</span>
                  <span className="font-semibold text-foreground text-right">{member.tenure}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
