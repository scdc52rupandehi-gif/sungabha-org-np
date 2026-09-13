import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Events',
};

export const revalidate = 60; // Revalidate every minute

export default async function Page() {
  const supabase = await createClient();
  const { data: eventItems } = await supabase
    .from('news_events')
    .select('*')
    .eq('type', 'Event')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <>
      <Hero 
        title="Events" 
        subtitle="Join us at our upcoming events and activities."
        backgroundImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
      />
      <Section className="py-24">
        <div className="max-w-6xl mx-auto">
          {!eventItems || eventItems.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">
              No events available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventItems.map((item: any) => (
                <Card key={item.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                  {item.featured_image && (
                    <div className="w-full h-48 overflow-hidden bg-zinc-100">
                      <img src={item.featured_image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader className="flex-grow">
                    <div className="text-xs text-brand-blue mb-2 font-medium">
                      {item.event_date ? format(new Date(item.event_date), 'MMMM dd, yyyy') : format(new Date(item.created_at), 'MMMM dd, yyyy')}
                      {item.event_location && ` • ${item.event_location}`}
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
                        className="text-brand-blue hover:underline text-sm font-medium flex items-center gap-1 mt-auto"
                      >
                        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
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
