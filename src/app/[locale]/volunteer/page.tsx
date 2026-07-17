import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import VolunteerForm from './VolunteerForm';

export const metadata: Metadata = {
  title: 'Volunteer Registration | SCDC',
  description: 'Join SCDC as a volunteer and contribute to community development.',
};

export default function Page() {
  return (
    <>
      <Hero 
        title="Volunteer Registration" 
        subtitle="Join our dedicated team of volunteers and make a real impact in the community."
        backgroundImage="/Image/Volunteer Section.png"
      />
      <Section className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
        <VolunteerForm />
      </Section>
    </>
  );
}
