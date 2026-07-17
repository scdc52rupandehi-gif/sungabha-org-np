"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = () => {
    const nextLocale = locale === 'en' ? 'ne' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={handleToggle}
      className="px-3 py-1.5 rounded-full text-xs font-bold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors ml-2"
    >
      {locale === 'en' ? 'नेपाली' : 'English'}
    </button>
  );
}
