import React from 'react';
import AdminLayoutClient from '@/components/AdminLayoutClient';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
