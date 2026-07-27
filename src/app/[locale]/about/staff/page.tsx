import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { UserCircle2 } from 'lucide-react';

import { getStaff } from '@/app/actions/staff';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Staff',
};

export default async function Page() {
  const staffMembers = await getStaff();
  
  const topLeadership = staffMembers.slice(0, 4);
  const otherStaff = staffMembers.slice(4);

  return (
    <>
      <Hero 
        title="Our Staff" 
        subtitle="Meet the dedicated team driving our mission forward."
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
      />
      <Section className="py-24">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Top Leadership Cards */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold font-heading text-foreground">Core Leadership</h2>
              <p className="text-muted-foreground mt-2">The people guiding our vision and operations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topLeadership.map((staff) => (
                <div key={staff.id} className="bg-card border border-border shadow-md rounded-3xl p-6 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-40 h-40 mx-auto rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors mb-6 overflow-hidden relative shadow-sm border-4 border-white dark:border-zinc-800">
                    {staff.image_url ? (
                      <Image src={staff.image_url} alt={staff.name} fill className="object-cover" />
                    ) : (
                      <UserCircle2 className="w-20 h-20" />
                    )}
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-1">{staff.name}</h3>
                  <p className="text-sm font-medium text-brand-blue bg-brand-blue/10 inline-block px-3 py-1 rounded-full">{staff.position}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Other Staff Table */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold font-heading text-foreground">Our Dedicated Team</h2>
              <p className="text-muted-foreground mt-2">The individuals working tirelessly on the ground</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherStaff.map((staff) => (
                <div key={staff.id} className="bg-card border border-border shadow-md rounded-3xl p-6 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-40 h-40 mx-auto rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors mb-6 overflow-hidden relative shadow-sm border-4 border-white dark:border-zinc-800">
                    {staff.image_url ? (
                      <Image src={staff.image_url} alt={staff.name} fill className="object-cover" />
                    ) : (
                      <UserCircle2 className="w-20 h-20" />
                    )}
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-1">{staff.name}</h3>
                  <p className="text-sm font-medium text-brand-blue bg-brand-blue/10 inline-block px-3 py-1 rounded-full">{staff.position}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Section>
    </>
  );
}
