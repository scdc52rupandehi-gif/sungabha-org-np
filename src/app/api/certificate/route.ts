import { NextRequest } from 'next/server';
import { getCertificateHtml } from '@/lib/certificateTemplate';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name') || 'Valued Donor';
  const amount = searchParams.get('amount') || '';
  const purpose = searchParams.get('purpose') || '';
  const date = searchParams.get('date') || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const html = getCertificateHtml(name, date, amount, purpose);
  
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
