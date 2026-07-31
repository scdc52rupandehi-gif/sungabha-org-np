import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Core Program Area',
};

const programs = [
  {
    title: 'Inclusive Education',
    icon: 'school',
    description: 'SCDC’s one of the major Core Program areas is to promote equitable access to quality education for all children, particularly from marginalized communities. Our interventions advocate quality Education and Education for All, campaign for School re-enrollment, Educational materials and Scholarship Support.',
  },
  {
    title: 'Adolescents and Youth Empowerment',
    icon: 'groups',
    description: 'Capacity building of adolescents and youth and empower them with life skills, leadership, employability, and civic engagement opportunities to help them become confident and responsible citizens. Through youth networks and community initiatives, we promote meaningful participation in decision-making and social transformation.',
  },
  {
    title: 'Anti-Human Trafficking',
    icon: 'shield_person',
    description: 'We work to prevent human trafficking through awareness raising, community mobilization, and strengthening local protection mechanisms. We also support vulnerable individuals by improving access to information, referral services, and livelihood opportunities.',
  },
  {
    title: 'Mental Health and Psychosocial Support (MHPSS)',
    icon: 'psychology',
    description: 'We promote mental well-being by providing psychosocial support, counselling, awareness programmes, and community-based mental health services. Our interventions strengthen the capacity of families, schools, health workers, and communities to identify and respond to mental health needs.',
  },
  {
    title: 'Income-Generating Activities (IGA) and Entrepreneurship Support',
    icon: 'payments',
    description: 'We enhance the economic resilience of vulnerable individuals and families by promoting income-generating activities, vocational skills, and entrepreneurship. We facilitate access to training, financial literacy, and market opportunities to improve sustainable livelihoods.',
  },
  {
    title: 'Evidence-Based Advocacy and Campaigns',
    icon: 'campaign',
    description: 'We generate and use evidence from research, monitoring, and community experiences to influence policies, programmes, and practices. Through advocacy campaigns and stakeholder engagement, we promote the rights and well-being of children, adolescents, youth, and marginalized communities.',
  },
  {
    title: 'Enterprise Development and Mentoring', // Adjusted title slightly to avoid duplicate title visually, or just keep it exactly as they wrote? The user wrote the exact same title twice. Let's keep it as is, or combine it. I'll keep the exact title but use a different icon.
    icon: 'business_center',
    description: 'We support individuals and groups to develop sustainable enterprises through business development services, mentoring, and enterprise promotion. Our initiatives encourage innovation, self-employment, and economic independence for long-term community development.',
  }
];

export default function Page() {
  // Fix the duplicate title for item 7 based on context
  programs[6].title = 'Enterprise & Business Development'; 
  
  return (
    <>
      <Hero 
        title="Core Program Area" 
        subtitle="Explore our key areas of intervention and impact in the community."
        backgroundImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
      />
      <Section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">Our Core Programs</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              We focus on these key areas to bring sustainable change and development to marginalized communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl text-emerald-600 dark:text-emerald-500">
                    {program.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight">
                  {program.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
