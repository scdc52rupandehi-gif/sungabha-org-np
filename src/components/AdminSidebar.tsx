"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LayoutDashboard, Users, FileText, Image as ImageIcon, Briefcase, Heart, Mail, Settings, LogOut, Grid, UserCheck, UsersRound, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);
  
  const routes = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users & Roles', href: '/admin/users', icon: Users },
    { name: 'Projects', href: '/admin/projects', icon: Briefcase },
    { name: 'Programs', href: '/admin/programs', icon: Grid },
    { name: 'News & Events', href: '/admin/news', icon: FileText },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Donations', href: '/admin/donations', icon: Heart },
    { name: 'Volunteers', href: '/admin/volunteers', icon: UserCheck },
    { name: 'Partners', href: '/admin/partners', icon: UsersRound },
    { name: 'Messages', href: '/admin/messages', icon: Mail },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <aside className={cn(
      "bg-card text-foreground flex-col hidden md:flex h-full shrink-0 border-r border-border transition-all duration-300 relative",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-card border border-border rounded-full p-1 z-50 text-muted-foreground hover:text-foreground shadow-sm"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="h-16 flex items-center px-4 border-b border-border shrink-0">
        <div className="relative w-8 h-8 flex-shrink-0 mr-3">
          <Image src="/Logo.png" alt="SCDC Logo" fill className="object-contain" />
        </div>
        {!collapsed && (
          <span className="font-heading font-bold text-lg leading-none tracking-tight">SCDC Admin</span>
        )}
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {routes.map((route) => {
          const isActive = pathname === route.href || (pathname.startsWith(route.href) && route.href !== '/admin');
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive 
                  ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              title={collapsed ? route.name : undefined}
            >
              <route.icon size={18} className={cn("flex-shrink-0", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground transition-colors")} />
              {!collapsed && (
                <span className="truncate">{route.name}</span>
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border shrink-0">
        <button 
          onClick={handleLogout} 
          className={cn(
            "flex items-center gap-3 py-2.5 w-full text-left text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors group",
            collapsed ? "justify-center px-0" : "px-3"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
