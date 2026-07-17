import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1220" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sungabha.org.np"),
  title: {
    default: "Sungabha Community Development Centre (SCDC)",
    template: "%s | SCDC Nepal",
  },
  description: "SCDC is a non-governmental organization working towards a justice-able and equitable society by improving the livelihoods of marginalized communities in Nepal.",
  keywords: ["SCDC", "NGO Nepal", "Sungabha", "Community Development", "Rupandehi NGO", "Women Empowerment", "Nepal Charity"],
  authors: [{ name: "SCDC" }],
  creator: "SCDC",
  icons: {
    icon: "/Logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sungabha.org.np",
    title: "Sungabha Community Development Centre (SCDC)",
    description: "Empowering Communities for a Better Tomorrow in rural Nepal.",
    siteName: "SCDC Nepal",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SCDC Nepal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SCDC Nepal",
    description: "Empowering Communities for a Better Tomorrow in rural Nepal.",
    images: ["/og-image.jpg"],
    creator: "@scdcnepal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={cn(inter.variable, poppins.variable)}>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased text-foreground flex flex-col",
      )}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <Toaster position="bottom-right" richColors />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
