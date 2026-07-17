import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News',
};

export default function Page() {
  return (
    <>
      <Hero 
        title="News" 
        subtitle="Detailed information about News."
        backgroundImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
      />
      <Section className="py-24">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-emerald-600 dark:text-emerald-500">construction</span>
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Content Coming Soon</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            This module is connected to the Supabase database. Real data will be populated here dynamically once entered through the Admin Dashboard.
          </p>
        </div>
      </Section>
    </>
  );
}
