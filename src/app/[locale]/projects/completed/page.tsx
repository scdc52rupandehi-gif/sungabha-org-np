import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { Target, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Completed Projects | SCDC',
};

export default function Page() {
  const projects = [
    {
      title: "Empowering Adolescents (SAMVAD) Programme",
      partner: "Stromme Foundation",
      duration: "2014-2024",
      achievements: [
        "Operated SAMVAD Learning Centres.",
        "Conducted leadership and capacity-building programmes.",
        "Provided entrepreneurship and income-generating activity (IGA) training and support.",
        "Formed and mobilized SAMVAD Graduate Forums and Networks."
      ]
    },
    {
      title: "Anti-Human Trafficking Project",
      partner: "United Mission to Nepal (UMN)",
      duration: "2011-2013 & 2018-2021",
      achievements: [
        "Raised awareness on human trafficking and gender-based violence.",
        "Built the capacity of youth and women.",
        "Formed and mobilized mothers' groups and adolescent girls' groups.",
        "Supported income-generating activities (IGA) for women's economic empowerment."
      ]
    },
    {
      title: "Adolescent Sexual and Reproductive Health Project",
      partner: "United Mission to Nepal (UMN)",
      duration: "2019-2020",
      achievements: [
        "Raised awareness through peer educator mobilization.",
        "Built the capacity of adolescents and students.",
        "Conducted training for teachers and health workers.",
        "Promoted adolescent-friendly sexual and reproductive health services."
      ]
    },
    {
      title: "Mental Health Project",
      partner: "United Mission to Nepal (UMN)",
      duration: "2019-2020",
      achievements: [
        "Conducted mental health awareness campaigns.",
        "Provided psychosocial counselling services.",
        "Supported access to essential medicines.",
        "Built the capacity of health workers.",
        "Formed and mobilized Self-Help Groups (SHGs).",
        "Supported income-generating activities for people with mental health conditions."
      ]
    },
    {
      title: "SEEDS (Socio-Economic Empowerment for Dignity and Sustainability) Programme",
      partner: "Stromme Foundation",
      duration: "2015-2017",
      achievements: [
        "Promoted inclusive education through SAMVAD Centres.",
        "Formed and strengthened Community-Based Organizations (CBOs).",
        "Established and mobilized Self-Help Groups (SHGs).",
        "Supported Early Childhood Development (ECD) and Community-Based Coaching Classes (CMCC).",
        "Promoted income generation, livelihoods, and entrepreneurship development."
      ]
    },
    {
      title: "Education Project",
      partner: "World Vision International",
      duration: "2011-2015",
      achievements: [
        "Promoted quality education in schools.",
        "Built the capacity of teachers and School Management Committees (SMCs).",
        "Formed and mobilized Child Clubs to encourage student participation.",
        "Retrofitted school buildings to improve safety and disaster resilience."
      ]
    },
    {
      title: "HIV/AIDS Prevention Project",
      partner: "United Mission to Nepal (UMN)",
      duration: "2009-2014",
      achievements: [
        "Conducted HIV/AIDS awareness and prevention campaigns.",
        "Mobilized peer educators to educate youth.",
        "Organized and supported people living with HIV/AIDS.",
        "Formed Village AIDS Coordination Committees for awareness, advocacy, and rehabilitation."
      ]
    },
    {
      title: "Community-Based Rehabilitation (CBR) for Persons with Disabilities",
      partner: "INF Nepal",
      duration: "2004-2011",
      achievements: [
        "Organized and strengthened organizations of persons with disabilities.",
        "Provided capacity-building and skill development opportunities.",
        "Strengthened community-based rehabilitation systems and services."
      ]
    },
    {
      title: "Youth Information Programme",
      partner: "Nepal Family Planning Association (NFPA)",
      duration: "2054-2059 B.S.",
      achievements: [
        "Established and mobilized Youth Information Centres.",
        "Conducted Youth Exchange Programmes.",
        "Organized capacity-building and skill development training for youth."
      ]
    }
  ];

  return (
    <>
      <Hero 
        title="Completed Projects" 
        subtitle="A summary of our past projects and key achievements over the years."
        backgroundImage="/Image/476814918_920127853644624_64978360843978164_n.jpg"
      />
      <Section className="py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-12">
          {projects.map((project, i) => (
            <div key={i} className="bg-card border border-border shadow-md rounded-3xl p-8 md:p-10 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-7 h-7 text-brand-blue" />
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{project.title}</h2>
              </div>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-brand-green/10 text-brand-green text-sm font-semibold rounded-full border border-brand-green/20">
                  Partner: {project.partner}
                </span>
                <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-sm font-semibold rounded-full border border-brand-blue/20">
                  Duration: {project.duration}
                </span>
              </div>
              <ul className="space-y-4">
                {project.achievements.map((achievement, j) => (
                  <li key={j} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-6 h-6 text-brand-green flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-muted-foreground font-medium leading-relaxed">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
