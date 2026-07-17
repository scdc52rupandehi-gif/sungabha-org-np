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
      title: "HIV/AIDS Project",
      achievements: [
        "5 VACC has been formed at local government level and are mobilized for prevention of HIV/AIDS.",
        "76 HIV infected people have formed AWAZ Samuha at local level and transmission rate has been reduced by 51%.",
        "Community people are aware on HIV/AIDS and have reduced the discriminative behavior towards HIV/AIDS infected people."
      ]
    },
    {
      title: "Anti Human Trafficking",
      achievements: [
        "396 families Benefitted from the Project implemented by SCDC, United mission to Nepal funded Project from 2017-2021",
        "7 Women groups formed and are in mobilization to fight against Human Trafficking & 5 Adolescents groups who have been educating other adolescents to protect themselves from trafficking."
      ]
    },
    {
      title: "Adolescents Sexual Reproductive Health Project",
      achievements: [
        "550 families benefitted from the program implemented by SCDC, UMN Funded Project (2018-2020).",
        "ASRH groups formed and mobilized in 12 School of two working municipals.",
        "Adolescents girls' friendly school Health Corner supported in 12 Schools.",
        "Adolescents Peers to peers' education system has efficiently sensitized on ASRH in schools and community."
      ]
    },
    {
      title: "SEEDS/SAMVAD Project",
      achievements: [
        "More than 3000 adolescents have improved in life skills and have built confidence to protect themselves.",
        "397 drop out adolescents are re-enrolled in school; 20 child marriage cases stopped.",
        "Under the 'Tole Tole ma wada' campaign by SATHEE network, 68 adolescents received birth certificates & citizenship recommendations.",
        "The learning of SAMVAD has been appreciated by local government so Kanchan Rural Municipal supported for the operation of 5 school SAMVAD."
      ]
    },
    {
      title: "Mental Health Project",
      achievements: [
        "In total 209 mental health affected people are in recovering stage after receiving the treatment.",
        "Reduced social discriminative behavior towards mental health affected people.",
        "Mental health affected people have good access to services provided by government hospital."
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
