import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Notices',
};

export const revalidate = 60;

export default async function Page() {
  const supabase = await createClient();
  const { data: noticeItems } = await supabase
    .from('news_events')
    .select('*')
    .eq('type', 'Notice')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <>
      <Hero 
        title="Notices" 
        subtitle="Important announcements and notices."
        backgroundImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
      />
      <Section className="py-24">
        <div className="max-w-6xl mx-auto">
          {!noticeItems || noticeItems.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">
              No notices available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticeItems.map((item: any) => (
                <Card key={item.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                  {item.featured_image && (
                    <div className="w-full h-48 overflow-hidden bg-zinc-100">
                      <img src={item.featured_image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader className="flex-grow">
                    <div className="text-xs text-brand-blue mb-2 font-medium">
                      {format(new Date(item.created_at), 'MMMM dd, yyyy')}
                    </div>
                    <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4">
                      {item.content}
                    </p>
                    {item.attached_file_url && (
                      <a 
                        href={item.attached_file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brand-blue hover:underline text-sm font-medium flex items-center gap-2 mt-auto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                        Download PDF
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
