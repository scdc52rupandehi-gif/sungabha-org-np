import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { UserCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Executive Committee | SCDC',
};

export default function Page() {
  const members = [
    { name: "Amrita Thapa", role: "Chairperson", exp: "15 Years", tenure: "29-01-2025 to 29-01-2027" },
    { name: "Hema Belbase", role: "Vice chairperson", exp: "10 Years", tenure: "29-01-2025 to 29-01-2027" },
    { name: "Pushparaj Sapkota", role: "Secretary", exp: "3 Years", tenure: "29-01-2025 to 29-01-2027", image: "/Executive Committee Image/Pushparaj Sapkota.jpg" },
    { name: "Khadananda Gyawali", role: "Treasurer", exp: "4 Years", tenure: "29-01-2025 to 29-01-2027" },
    { name: "Pomnath Gotame", role: "Vice-Secretory", exp: "20 Years", tenure: "29-01-2025 to 29-01-2027" },
    { name: "Lata Shreeis Magar Kshetri", role: "Member", exp: "2 Years", tenure: "29-01-2025 to 29-01-2027" },
    { name: "Tilkumari Khatri", role: "Member", exp: "5 Years", tenure: "29-01-2025 to 29-01-2027" },
    { name: "Shobhakhar Acharya", role: "Member", exp: "10 Years", tenure: "29-01-2025 to 29-01-2027" },
    { name: "Deb Bahadur Phauja", role: "Member", exp: "2 Years", tenure: "29-01-2025 to 29-01-2027" },
    { name: "Kamala BK", role: "Member", exp: "4 Years", tenure: "29-01-2025 to 29-01-2027" },
    { name: "Jaykala Gotame", role: "Member", exp: "3 Years", tenure: "29-01-2025 to 29-01-2027" }
  ];

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
            {members.map((member, i) => (
              <div key={i} className="bg-card border border-border shadow-md rounded-3xl p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                {member.image ? (
                  <div className="w-32 h-32 relative rounded-full overflow-hidden mb-6 border-4 border-brand-blue/20">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-brand-blue/10 rounded-full flex items-center justify-center mb-6">
                    <UserCircle2 className="w-16 h-16 text-brand-blue" />
                  </div>
                )}
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{member.name}</h3>
                <span className="inline-block px-4 py-1.5 bg-brand-green/10 text-brand-green text-sm font-bold uppercase tracking-wider rounded-full mb-4">
                  {member.role}
                </span>
                <div className="w-full h-px bg-border my-4" />
                <div className="w-full flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground font-medium">Experience</span>
                  <span className="font-semibold text-foreground">{member.exp}</span>
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
