import React from 'react';
import HeroSlider from '@/components/HeroSlider';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import PhotoGallery from '@/components/PhotoGallery';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users, Target, Heart, CheckCircle2, Award, Globe, MessageSquare } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';

async function getProjects(): Promise<any[]> {
  return [
    {
      id: "1",
      title: "HIV/AIDS Project",
      description: "5 VACC has been formed at local government level and are mobilized for prevention of HIV/AIDS. 76 HIV infected people have formed AWAZ Samuha at local level and transmission rate has been reduced by 51%.",
      featured_image: "/Image/Health%20%26%20Nutrition.png",
      status: "Completed",
      location: "Rupandehi",
      slug: "hiv-aids-project"
    },
    {
      id: "2",
      title: "Anti Human Trafficking",
      description: "396 families Benefitted from the Project. 7 Women groups formed and mobilized to fight against Human Trafficking alongside adolescent peer educators.",
      featured_image: "/Image/Women%20Empowerment.png",
      status: "Completed",
      location: "Rupandehi",
      slug: "anti-human-trafficking"
    },
    {
      id: "3",
      title: "SEEDS/SAMVAD Education",
      description: "Re-enrolling dropped out adolescents, improving life skills, and preventing child marriages through youth forums and SATHEE networks.",
      featured_image: "/Image/Education%20Program.png",
      status: "Completed",
      location: "Kanchan Rural Municipal",
      slug: "seeds-samvad-project"
    }
  ];
}

export default async function Home() {
  const projects = await getProjects();
  const t = await getTranslations('HomePage');
  const locale = await getLocale();

  const slides = [
    {
      title: t('heroTitle'),
      subtitle: t('heroSubtitle'),
      backgroundImage: "/Image/Homepage Hero Banner.png"
    },
    {
      title: "Quality Education for Every Child",
      subtitle: "Ensuring access to basic education, reducing dropout rates, and empowering the youth through continuous learning and skill development.",
      backgroundImage: "/Image/Education Program.png"
    },
    {
      title: "Empowering Women, Transforming Societies",
      subtitle: "Fostering gender equality, leadership, and economic independence for women and marginalized groups across rural communities.",
      backgroundImage: "/Image/Women Empowerment.png"
    },
    {
      title: "Promoting Health and Well-being",
      subtitle: "Improving community health standards, maternal care, and nutritional awareness to ensure a healthier tomorrow for everyone.",
      backgroundImage: "/Image/Health & Nutrition.png"
    },
    {
      title: "Building Sustainable Livelihoods",
      subtitle: "Equipping communities with modern agricultural skills, vocational training, and the necessary resources for true economic self-reliance.",
      backgroundImage: "/Image/Sustainable Livelihood.png"
    }
  ];

  return (
    <>
      <HeroSlider 
        slides={slides}
        primaryAction={{ label: t('exploreProjects'), href: "/projects/active" }}
        secondaryAction={{ label: "Become a Volunteer", href: "/volunteer" }}
      />
      
      {/* Quick Impact Stats */}
      <div className="bg-brand-blue relative z-20 -mt-10 mx-4 lg:mx-auto max-w-6xl rounded-2xl shadow-2xl p-8 lg:p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
          <div className="flex flex-col items-center text-center px-4 pt-4 md:pt-0">
            <Users className="w-10 h-10 text-white mb-4 opacity-80" />
            <h3 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-2">25K+</h3>
            <p className="text-white/80 font-medium">Lives Impacted</p>
          </div>
          <div className="flex flex-col items-center text-center px-4 pt-4 md:pt-0">
            <Target className="w-10 h-10 text-white mb-4 opacity-80" />
            <h3 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-2">50+</h3>
            <p className="text-white/80 font-medium">Projects Completed</p>
          </div>
          <div className="flex flex-col items-center text-center px-4 pt-4 md:pt-0">
            <Globe className="w-10 h-10 text-white mb-4 opacity-80" />
            <h3 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-2">12+</h3>
            <p className="text-white/80 font-medium">Districts Reached</p>
          </div>
          <div className="flex flex-col items-center text-center px-4 pt-4 md:pt-0">
            <Award className="w-10 h-10 text-white mb-4 opacity-80" />
            <h3 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-2">20+</h3>
            <p className="text-white/80 font-medium">Years of Service</p>
          </div>
        </div>
      </div>

      {/* About SCDC Section */}
      <Section className="pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              Who We Are
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight mb-6">
              Dedicated to building a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-500">justice-able and equitable society.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              SCDC is dedicated to improving the quality of life of marginalized, disadvantaged, and vulnerable communities through inclusive and sustainable development initiatives. Established in 2005, the organization works in the areas of education, women's empowerment, disability inclusion, health promotion, livelihood development, and community capacity building.
            </p>
            <ul className="space-y-4 mb-10">
              {['Women & Child Empowerment', 'Mental Health Awareness', 'Anti Human Trafficking', 'Livelihood & Agriculture'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                  <CheckCircle2 className="text-brand-blue w-6 h-6 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/about/history" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:bg-brand-blue hover:text-white transition-all shadow-lg active:scale-95">
              Read Our History <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue to-brand-green rounded-3xl transform rotate-3 scale-105 opacity-20 blur-xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border h-[600px] w-full">
              <Image 
                src="/Image/About SCDC.png" 
                alt="SCDC Community work in Nepal" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & Vision Section */}
      <Section dark title="Our Vision & Mission" subtitle="Guided by principles of transparency, equity, and sustainability." className="bg-zinc-950">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="bg-card/50 backdrop-blur-xl rounded-3xl p-10 md:p-12 shadow-2xl border border-border text-center hover:-translate-y-2 transition-transform duration-500 group">
            <div className="w-24 h-24 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
              <Target className="w-12 h-12 text-brand-blue" />
            </div>
            <h2 className="text-brand-blue font-heading font-bold text-3xl mb-6">Vision</h2>
            <p className="text-foreground text-2xl md:text-3xl leading-snug font-medium">
              "Justice-able and equitable society"
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-xl rounded-3xl p-10 md:p-12 shadow-2xl border border-border text-center hover:-translate-y-2 transition-transform duration-500 group">
            <div className="w-24 h-24 bg-brand-green/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
              <Heart className="w-12 h-12 text-brand-green" />
            </div>
            <h2 className="text-brand-green font-heading font-bold text-3xl mb-6">Mission</h2>
            <p className="text-foreground text-xl md:text-2xl leading-snug font-medium">
              "To improve the quality of life of marginalized and vulnerable communities through community-led initiatives."
            </p>
          </div>
        </div>
      </Section>

      {/* Photo Gallery */}
      <PhotoGallery />

      {/* Featured Projects */}
      <Section title="Featured Projects" subtitle="Discover how we are making a real impact in rural communities.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {projects.map((p) => {
            const displayTitle = locale === 'ne' && p.title_ne ? p.title_ne : p.title;
            const displayDesc = locale === 'ne' && p.description_ne ? p.description_ne : p.description;
            return (
              <ProjectCard 
                key={p.id}
                id={p.id}
                title={displayTitle}
                excerpt={displayDesc?.substring(0, 100) + "..."}
                image={p.featured_image}
                status={p.status as any}
                location={p.location || (locale === 'ne' ? "रुपन्देही" : "Rupandehi")}
                href={"/projects/" + (p.slug || p.id)}
              />
            )
          })}
        </div>
        <div className="text-center mt-16">
          <Link href="/projects/active" className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-8 py-4 rounded-xl font-bold hover:bg-brand-blue hover:text-white transition-all shadow-md active:scale-95">
            {t('exploreProjects')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Section>
      
      {/* Call to Action Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542810634-71277d95dc8c?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-fixed bg-center mix-blend-multiply z-0" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <MessageSquare className="w-16 h-16 text-white/50 mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Help Us Make a Difference Today
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed font-medium">
            Whether you want to volunteer your time, partner with us, or make a donation, your contribution helps build a stronger community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/donate" className="bg-white text-brand-blue px-8 py-4 rounded-xl font-bold text-lg hover:bg-zinc-100 transition-all shadow-xl">
              Make a Donation
            </Link>
            <Link href="/volunteer" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[400px] md:h-[500px] relative">
        <iframe 
          src="https://maps.google.com/maps?q=Sungabha%20Community%20Development%20Center%20(SCDC)&t=&z=14&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full grayscale-[20%] contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        />
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-border">
          <h3 className="font-bold text-foreground font-heading">Find Us on Google Maps</h3>
          <p className="text-sm text-muted-foreground mt-1">Sungabha Community Development Center (SCDC)</p>
          <a href="https://share.google/MxNOIE2JTIzLPkFzi" target="_blank" rel="noreferrer" className="text-sm text-brand-blue font-bold hover:underline mt-2 inline-block">
            Get Directions →
          </a>
        </div>
      </section>
    </>
  );
}
