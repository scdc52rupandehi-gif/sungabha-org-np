import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { UserCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Staff',
};

const staffMembers = [
  { id: 1, name: 'Gopal Bahadur K.C', position: 'Executive Director' },
  { id: 2, name: 'Srijana Chaudhary', position: 'Program Coordinator' },
  { id: 3, name: 'Umesh Devkota', position: 'Admin & Finance Officer' },
  { id: 4, name: 'Khoma Neupane', position: 'Social Mobilization Officer' },
  { id: 5, name: 'Susmita Nepali', position: 'Social Mobilizer' },
  { id: 6, name: 'Samiksha Rana', position: 'Social Mobilizer' },
  { id: 7, name: 'Sunita Harijan', position: 'Social Mobilizer' },
  { id: 8, name: 'Sushila Chhetri', position: 'Social Mobilizer' },
  { id: 9, name: 'Srijana Tharu', position: 'Social Mobilizer' },
  { id: 10, name: 'Bishnu B.K Gotame Sunar', position: 'Psychosocial Counsellor' },
  { id: 11, name: 'Sabitra Acharya Paudel', position: 'Psychosocial Counsellor' },
  { id: 12, name: 'Ramkumari Chaudhary', position: 'Psychosocial Counsellor' },
  { id: 13, name: 'Bijay Kumar BK Lohar', position: 'Social Mobilizer' },
  { id: 14, name: 'Sangita Chhetri', position: 'Office Assistant' },
];

export default function Page() {
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
                  <div className="w-20 h-20 mx-auto rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors mb-4">
                    <UserCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">{staff.name}</h3>
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
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="py-4 px-6 font-bold text-foreground w-20 text-center">S.N.</th>
                      <th className="py-4 px-6 font-bold text-foreground">Name</th>
                      <th className="py-4 px-6 font-bold text-foreground">Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {otherStaff.map((staff, index) => (
                      <tr 
                        key={staff.id} 
                        className="hover:bg-accent/50 transition-colors group"
                      >
                        <td className="py-4 px-6 text-muted-foreground text-center font-medium">
                          {index + 5}
                        </td>
                        <td className="py-4 px-6 font-semibold text-foreground flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                            <UserCircle2 className="w-6 h-6" />
                          </div>
                          {staff.name}
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">
                          <span className="inline-flex px-3 py-1 rounded-full bg-accent text-sm font-medium">
                            {staff.position}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </Section>
    </>
  );
}
