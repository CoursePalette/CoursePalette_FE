import { NextResponse } from 'next/server';

console.log('>>> [route.ts] MINIMAL HANDLER: Parsing file <<<');

// NextAuth 관련 코드 모두 제거
// const handler = NextAuth(...);

// 임시 핸들러 함수 직접 정의
async function handlerFunction(request: Request) {
  const url = new URL(request.url);
  console.log('>>> [route.ts] MINIMAL HANDLER CALLED <<<', url.pathname); // 함수 호출 로그

  // 어떤 경로로 호출되었는지 확인
  if (url.pathname.includes('/api/auth/session')) {
    return NextResponse.json({ message: 'Minimal Session Endpoint OK' });
  }
  if (url.pathname.includes('/api/auth/signin')) {
    return NextResponse.json({ message: 'Minimal Signin Endpoint OK' });
  }
  // 다른 필요한 경로에 대한 임시 응답 추가 가능

  // 기본 응답
  return NextResponse.json({
    message: `Minimal Auth Endpoint OK for path: ${url.pathname}`,
  });
}

export { handlerFunction as GET, handlerFunction as POST };
