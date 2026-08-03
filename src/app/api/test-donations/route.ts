import { getDonations } from '@/app/actions/donations'; import { NextResponse } from 'next/server'; export async function GET() { const res = await getDonations(); return NextResponse.json(res); }
