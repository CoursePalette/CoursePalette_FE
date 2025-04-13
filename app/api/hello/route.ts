import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
  console.log('>>> HELLO API ROUTE CALLED - Vercel <<<'); // Function Log 확인용
  return NextResponse.json({ message: 'Hello from Vercel!' });
}
