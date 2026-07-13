import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { CheckCircle2, Target, Heart, Shield, Lightbulb, Users, Leaf, Building2, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Objectives | SCDC',
};

export default function Page() {
  const objectives = [
    { icon: Target, text: "Improve the socio-economic conditions of marginalized, disadvantaged, and vulnerable communities through inclusive and sustainable development programs." },
    { icon: Heart, text: "Promote quality education, health, nutrition, and WASH services to enhance the well-being and quality of life of children, youth, women, and communities." },
    { icon: Users, text: "Empower women, youth, and persons with disabilities by promoting leadership, skills development, economic opportunities, and social inclusion." },
    { icon: Lightbulb, text: "Strengthen sustainable livelihoods through vocational training, entrepreneurship development, agriculture, and income-generating activities." },
    { icon: Shield, text: "Promote gender equality, human rights, child protection, social inclusion, and good governance in all development initiatives." },
    { icon: Leaf, text: "Enhance community resilience to climate change, disasters, and humanitarian emergencies through disaster risk reduction and environmental conservation." },
    { icon: Building2, text: "Strengthen the capacity of local governments, community institutions, and civil society organizations for participatory and accountable development." },
    { icon: Globe, text: "Build partnerships and contribute to the Sustainable Development Goals (SDGs) through innovative, community-driven, and evidence-based development programs." }
  ];

  return (
    <>
      <Hero 
        title="Our Objectives" 
        subtitle="The key goals driving our initiatives towards a justice-able and equitable society."
        backgroundImage="/Image/476814918_920127853644624_64978360843978164_n.jpg"
      />
      <Section className="py-24 bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {objectives.map((obj, i) => (
            <div key={i} className="bg-card border border-border shadow-md rounded-2xl p-8 flex gap-6 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <obj.icon className="w-7 h-7 text-brand-blue" />
              </div>
              <p className="text-foreground text-lg leading-relaxed font-medium">
                {obj.text}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
