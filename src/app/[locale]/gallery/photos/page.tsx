import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { getGalleryImages } from '@/app/actions/gallery';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Photo Gallery',
};

export default async function Page() {
  const images = await getGalleryImages();

  return (
    <>
      <Hero 
        title="Photo Gallery" 
        subtitle="Explore our visual journey."
        backgroundImage="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
      />
      <Section className="py-24">
        {images.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">No Photos Yet</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Check back soon for new photos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map(img => (
              <div key={img.id} className="group overflow-hidden rounded-2xl shadow-sm border border-border bg-card hover:shadow-md transition-all">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <Image 
                    src={img.image_url} 
                    alt={img.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground truncate">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
