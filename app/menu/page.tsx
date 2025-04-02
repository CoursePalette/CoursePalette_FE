'use client';

import Header from '@/components/atoms/Header';
import MenuBox from '@/components/atoms/MenuBox';
import { useSession } from 'next-auth/react';

export default function MenuPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    // 세션이 로딩되지 않으면 로그인 -> 여러 메뉴로 바뀜
    // 방지하기 위해 우선 null
    // 기회 있으면 로딩스피너 처리
    return null;
  }

  return (
    <div className='w-full h-full flex flex-col items-center py-[50px]'>
      <Header />
      <div className='w-full max-w-[768px]'>
        {session?.user?.backendJwt ? (
          <>
            <MenuBox text='내가 등록한 코스' url='course/mycourse' />
            <MenuBox text='즐겨찾기한 코스' url='course/favorite' />
            <MenuBox text='로그아웃' url='sign-out' />
            <MenuBox text='회원탈퇴' url='delete-account' />
          </>
        ) : (
          <MenuBox text='로그인' url='sign-in' />
        )}
      </div>
    </div>
  );
}
