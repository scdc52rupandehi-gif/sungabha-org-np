import React from 'react';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Metadata } from 'next';
import { getGalleryImages } from '@/app/actions/gallery';
import PhotoGalleryGrid from '@/components/PhotoGalleryGrid';

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
          <PhotoGalleryGrid images={images} />
        )}
      </Section>
    </>
  );
}
