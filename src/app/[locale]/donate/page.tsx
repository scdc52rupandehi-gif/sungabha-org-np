import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import DonateForm from '@/components/DonateForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Make a Donation',
};

export default function Page() {
  return (
    <>
      <Hero 
        title="Make a Donation" 
        subtitle="Detailed information about Make a Donation."
        backgroundImage="/Image/Donate  Support.png"
      />
      <Section className="py-24">
        <DonateForm />
      </Section>
    </>
  );
}
