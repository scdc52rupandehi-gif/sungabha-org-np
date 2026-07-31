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
      title: "Youth Information Programme in Support of Nepal Family Planning Association of Nepal 2055-2060",
      achievements: [
        "Formation of Youth information Centre and its Mobilization.",
        "Youth Exchange Program.",
        "Capacity building and skill development training."
      ]
    },
    {
      title: "Education Project 2011-2015",
      achievements: [
        "Promoting Quality Education.",
        "Capacity building of teachers and School Management Committees (SMCs).",
        "Formation and mobilization of Child Clubs.",
        "School building retrofitting to improve their safety and resilience."
      ]
    },
    {
      title: "Community Based Rehabilitation (CBR) for People with Disabilities 2065-2070",
      achievements: [
        "Organizing People with Disabilities.",
        "Capacity building and skill development to establish and strengthen Community based rehabilitation."
      ]
    },
    {
      title: "HIV/AIDS Project 2066-2072",
      achievements: [
        "Awareness Raising and prevention of HIV/AIDs.",
        "PEER education to Educate Youth about the HIV/AIDS and its risk.",
        "Organized HIV/AIDs contaminated People.",
        "Formed Village AIDS Coordination Committee to work on the awareness raising and advocate for the rights and rehabilitation."
      ]
    },
    {
      title: "Anti-Human Trafficking",
      achievements: [
        "Raising awareness on Human Trafficking.",
        "Capacity building of youth and women to fight against violence and human trafficking.",
        "Mother and adolescents girl group formation and mobilization to fight against Human Trafficking.",
        "IGA support to inspire women empowerment."
      ]
    },
    {
      title: "Adolescent Sexual Reproductive Health",
      achievements: [
        "Raising awareness through mobilization of PEER Education.",
        "Capacity building of adolescents and students.",
        "Teachers training and capacity building.",
        "Capacity building Health workers.",
        "Adolescents friendly Reproductive Health program."
      ]
    },
    {
      title: "Mental Health Project",
      achievements: [
        "Awareness Raising & Psychosocial Counselling services.",
        "Medicine Support.",
        "Capacity building of Health workers.",
        "SHG formation and Mobilization.",
        "IGA support to People with Mental Health Problems."
      ]
    },
    {
      title: "SEEDS (Socio-economic empowerment for Dignity and Sustainability) Programme",
      achievements: [
        "Promoting Inclusive Education through SAMVAD Operation.",
        "CBOs and SHGs formation, capacity building and mobilization.",
        "Quality Education through Early Child Development Program support and CMCC - Community based Coaching class.",
        "IGA, Livelihoods and Entrepreneurships Programme."
      ]
    },
    {
      title: "Empowering Adolescent (SAMVAD) Program",
      achievements: [
        "SAMVAD Centre operation.",
        "Adolescents and youth capacity building.",
        "IGA and entrepreneurship training and support.",
        "SAMVAD Graduate Forum and Network formation and Mobilization."
      ]
    },
    {
      title: "Mental Health and Well-being Project",
      achievements: [
        "Awareness Raising, Capacity building and Trainings.",
        "Mobilization of Trained FCHVs, Teachers, Health Workers.",
        "Psychosocial Support and Referral Service.",
        "IGA Support."
      ]
    },
    {
      title: "ICDP- Positive Parenting Programme",
      achievements: [
        "PEER-Educators Mobilization.",
        "ICDP orientation and training to the parents."
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
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-7 h-7 text-brand-blue" />
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{project.title}</h2>
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
