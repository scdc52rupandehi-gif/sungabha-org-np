import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Publications',
};

export const revalidate = 60;

export default async function Page() {
  const supabase = await createClient();
  const { data: publications } = await supabase
    .from('documents')
    .select('*')
    .eq('category', 'Publication')
    .order('created_at', { ascending: false });

  return (
    <>
      <Hero 
        title="Publications" 
        subtitle="Explore our latest publications and research."
        backgroundImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
      />
      <Section className="py-24">
        <div className="max-w-4xl mx-auto">
          {!publications || publications.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">
              No publications available at the moment.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {publications.map((item: any) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs text-brand-blue mb-1 font-medium">
                          {item.published_year ? `Published: ${item.published_year}` : format(new Date(item.created_at), 'MMMM dd, yyyy')}
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </div>
                      {item.file_url && (
                        <a 
                          href={item.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-brand-blue/90 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                          Download
                        </a>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
