import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const projectsData = [
  {
    title: "Mental Health and Well-being Project",
    slug: "mental-health-well-being",
    description: "Creating awareness about mental health, reducing stigma, and providing psychosocial support at community levels.",
    partner: "Stromme Foundation",
    duration: "2024-Present",
    status: "Ongoing",
    featured_image: "/Image/Projects/scdc_mental_health_project.jpg",
    location: "SCDC Work Area",
    achievements: [
      "Conducted community awareness programmes on mental health.",
      "Provided counselling services to affected individuals.",
      "Trained local health workers on basic psychosocial support."
    ],
    images: []
  },
  {
    title: "Empowering Adolescents (SAMVAD) Programme",
    slug: "empowering-adolescents-samvad",
    description: "A transformative education programme aimed at empowering marginalized adolescents, especially girls, through life skills and non-formal education.",
    partner: "Stromme Foundation",
    duration: "2014-2024",
    status: "Completed",
    featured_image: "/Image/Projects/scdc_samvad_adolescents.jpg",
    location: "SCDC Work Area",
    achievements: [
      "Operated SAMVAD Learning Centres.",
      "Conducted leadership and capacity-building programmes.",
      "Provided entrepreneurship and income-generating activity (IGA) training and support.",
      "Formed and mobilized SAMVAD Graduate Forums and Networks."
    ],
    images: []
  },
  {
    title: "Anti-Human Trafficking Project",
    slug: "anti-human-trafficking",
    description: "Preventing human trafficking and unsafe migration through community surveillance, awareness, and empowerment of vulnerable groups.",
    partner: "United Mission to Nepal (UMN)",
    duration: "2011-2013 & 2018-2021",
    status: "Completed",
    featured_image: "/Image/Projects/scdc_anti_trafficking.jpg",
    location: "Rupandehi",
    achievements: [
      "Raised awareness on human trafficking and gender-based violence.",
      "Strengthened local mechanisms for trafficking prevention.",
      "Supported survivors with rehabilitation and livelihood training."
    ],
    images: []
  },
  {
    title: "Adolescent Sexual and Reproductive Health Project",
    slug: "reproductive-health",
    description: "Educating adolescents on sexual and reproductive health rights (SRHR) and improving access to youth-friendly health services.",
    partner: "United Mission to Nepal (UMN)",
    duration: "2019-2020",
    status: "Completed",
    featured_image: "/Image/Projects/scdc_reproductive_health.jpg",
    location: "Rupandehi",
    achievements: [
      "Raised awareness through peer educator mobilization.",
      "Advocated for youth-friendly health services at local health posts.",
      "Distributed educational materials on SRHR."
    ],
    images: []
  },
  {
    title: "Mental Health Project",
    slug: "mental-health-umn",
    description: "Integrating mental health services into primary healthcare and raising awareness at the grassroots level.",
    partner: "United Mission to Nepal (UMN)",
    duration: "2019-2020",
    status: "Completed",
    featured_image: "/Image/Projects/scdc_mental_health_umn.jpg",
    location: "Rupandehi",
    achievements: [
      "Conducted mental health awareness campaigns.",
      "Trained community volunteers on identifying mental health issues.",
      "Facilitated referrals to specialized mental health services."
    ],
    images: []
  },
  {
    title: "SEEDS Programme",
    slug: "seeds-programme",
    description: "Socio-Economic Empowerment with Dignity and Sustainability (SEEDS) focusing on inclusive education and community empowerment.",
    partner: "Stromme Foundation",
    duration: "2015-2017",
    status: "Completed",
    featured_image: "/Image/Projects/scdc_seeds_empowerment.jpg",
    location: "Rupandehi",
    achievements: [
      "Promoted inclusive education through SAMVAD Centres.",
      "Supported community-led development initiatives.",
      "Enhanced livelihood opportunities for marginalized families."
    ],
    images: []
  },
  {
    title: "Education Project",
    slug: "education-project",
    description: "Enhancing the quality of basic education and ensuring access for children from marginalized communities.",
    partner: "World Vision International",
    duration: "2011-2015",
    status: "Completed",
    featured_image: "/Image/Projects/scdc_education_project.jpg",
    location: "Rupandehi",
    achievements: [
      "Promoted quality education in schools.",
      "Provided capacity-building training for School Management Committees (SMCs) and PTAs.",
      "Implemented early childhood development (ECD) programmes."
    ],
    images: []
  },
  {
    title: "HIV/AIDS Prevention Project",
    slug: "hiv-aids-prevention",
    description: "Creating awareness, reducing stigma, and promoting preventive measures against HIV/AIDS in vulnerable communities.",
    partner: "United Mission to Nepal (UMN)",
    duration: "2009-2014",
    status: "Completed",
    featured_image: "/Image/Projects/scdc_hiv_prevention.jpg",
    location: "Rupandehi",
    achievements: [
      "Conducted HIV/AIDS awareness and prevention campaigns.",
      "Supported infected and affected individuals through self-help groups.",
      "Advocated for the rights of people living with HIV/AIDS."
    ],
    images: []
  },
  {
    title: "CBR for Persons with Disabilities",
    slug: "cbr-disabilities",
    description: "Community-Based Rehabilitation (CBR) programme to empower and improve the lives of persons with disabilities.",
    partner: "INF Nepal",
    duration: "2004-2011",
    status: "Completed",
    featured_image: "/Image/Projects/scdc_cbr_disabilities.jpg",
    location: "Rupandehi",
    achievements: [
      "Organized and strengthened organizations of persons with disabilities.",
      "Provided assistive devices and rehabilitation services.",
      "Promoted inclusive education and livelihood opportunities."
    ],
    images: []
  },
  {
    title: "Youth Information Programme",
    slug: "youth-information",
    description: "Providing youth with access to information on reproductive health, career guidance, and life skills.",
    partner: "Nepal Family Planning Association (NFPA)",
    duration: "2054-2059 B.S.",
    status: "Completed",
    featured_image: "/Image/Projects/scdc_youth_information.jpg",
    location: "Rupandehi",
    achievements: [
      "Established and mobilized Youth Information Centres.",
      "Conducted peer education on reproductive health.",
      "Organized youth-led community awareness activities."
    ],
    images: []
  }
];

async function migrate() {
  console.log("Migrating projects to Supabase...");
  let count = 0;
  for (const project of projectsData) {
    const { data, error } = await supabase.from('projects').insert(project);
    if (error) {
      console.error("Error migrating project:", project.title, error.message);
    } else {
      console.log("Migrated:", project.title);
      count++;
    }
  }
  console.log(`Successfully migrated ${count} projects.`);
}

migrate();
