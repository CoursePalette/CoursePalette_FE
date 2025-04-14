'use client';

import { kakaoLogin, kakaoLogout } from '@/apis/kakao';
import Header from '@/components/atoms/Header';
import Loading from '@/components/atoms/Loading';
import MenuBox from '@/components/atoms/MenuBox';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className='w-full h-full flex justify-center items-center '>
        <Loading />
      </div>
    );
  }

  return (
    <main
      className='w-full h-full flex flex-col items-center py-[50px]'
      role='main'
    >
      <Header />
      <div className='w-full max-w-[768px]'>
        {session?.user?.backendJwt ? (
          <>
            <MenuBox
              text='내가 등록한 코스'
              onClick={() => router.push('course/mycourse')}
            />
            <MenuBox
              text='즐겨찾기한 코스'
              onClick={() => router.push('course/myfavorite')}
            />
            <MenuBox text='마이페이지' onClick={() => router.push('mypage')} />
            <MenuBox text='로그아웃' onClick={kakaoLogout} />
          </>
        ) : (
          <MenuBox text='로그인' onClick={kakaoLogin} />
        )}
      </div>
    </main>
  );
}
