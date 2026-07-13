import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { CheckCircle2, FileText, Network, GitBranch } from 'lucide-react';
import OrgChart from '@/components/OrgChart';

export const metadata: Metadata = {
  title: 'Structure & Policies | SCDC',
};

export default function Page() {
  const strategies = [
    "SCDC has commitments for the community to contribute 10-15 % of resource of community for any development activities.",
    "Community Based Action Committees (e.g., SAMVAD Support Team, VPAC, Village AIDS Coordination Committees, Child Clubs, Women Network) function for their rights with our regular technical support.",
    "SCDC inhibits 'Free Basic Education' by Government of Nepal as a Mandatory tool for the accessibility of education for all.",
    "'Adolescent and Youth are the key change agent to transform the society' is our main resource mobilization tool.",
    "Social inclusion and good governance is practiced at all program and personal levels.",
    "Use of past experience in the implementation of SAMVAD project.",
    "Human respect and dignity at all levels for social justice."
  ];

  const policies = [
    "Strategies and Sustainable Development Plan",
    "Personnel and Administrative Management Policy",
    "Child Protection Policy",
    "Local Resource Mobilization Policy Centre Plan",
    "Financial Policy (Procurement Policy)",
    "Revolving Fund Mobilization Policy",
    "Anti-Corruption & Whistle Blowing Policy",
    "Scholarship Policy",
    "Volunteers' Mobilization Policies",
    "GESI Policy",
    "Do No Harm Policy",
    "Environment and Climate Change Policy",
    "Participatory Monitoring and Evaluation Policy"
  ];

  return (
    <>
      <Hero 
        title="Structure & Policies" 
        subtitle="The fundamental guidelines and organizational hierarchy that shape our operations."
        backgroundImage="/Image/476814918_920127853644624_64978360843978164_n.jpg"
      />
      <Section className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Org Chart Section */}
          <div className="bg-card border border-border shadow-xl rounded-3xl p-10 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center">
                <GitBranch className="w-8 h-8 text-brand-green" />
              </div>
              <div>
                <h2 className="text-3xl font-heading font-bold text-foreground">Organizational Hierarchy</h2>
                <p className="text-muted-foreground mt-2">A visual representation of our governance and management structure.</p>
              </div>
            </div>
            <OrgChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Strategies */}
            <div className="bg-card border border-border shadow-xl rounded-3xl p-10 md:p-12 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                  <Network className="w-8 h-8 text-brand-blue" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-foreground">Strategies for Partner Deploy</h2>
              </div>
              <ul className="space-y-6">
                {strategies.map((strategy, i) => (
                  <li key={i} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-brand-blue flex-shrink-0 mt-1" />
                    <span className="text-lg text-muted-foreground leading-relaxed font-medium">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div className="bg-card border border-border shadow-xl rounded-3xl p-10 md:p-12 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-brand-green" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-foreground">Plan and Policies</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {policies.map((policy, i) => (
                  <li key={i} className="flex items-start gap-3 bg-muted/50 p-4 rounded-xl border border-border/50">
                    <div className="w-2 h-2 rounded-full bg-brand-green mt-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground leading-snug">{policy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </Section>
    </>
  );
}
