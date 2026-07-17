import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-brand-blue/30">
      <AdminSidebar />
      <div className="flex-1 overflow-auto flex flex-col bg-muted/30">
        <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">SCDC Control Panel</h1>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground leading-none mb-1">Super Admin</p>
                <p className="text-xs text-muted-foreground leading-none">scdc52rupandehi@gmail.com</p>
              </div>
              <div className="w-9 h-9 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-background">
                SA
              </div>
            </div>
          </div>
        </header>
        <main className="p-6 md:p-8 flex-1 overflow-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
