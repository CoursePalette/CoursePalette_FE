'use client';

import { useSession } from 'next-auth/react';
import { IoMenu } from 'react-icons/io5';
import { TiArrowLeft } from 'react-icons/ti';

import { usePathname, useRouter } from 'next/navigation';

import { useCallback } from 'react';

import UserProfile from './UserProfile';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleHome = useCallback(() => {
    router.replace('/');
  }, [router]);

  const handleMenu = useCallback(() => {
    if (pathname === '/main') return;
    router.push('/menu');
  }, [pathname, router]);

  return (
    <header className='w-full h-[50px] bg-white/80 backdrop-blur-lg border-b border-black flex items-center px-[20px] justify-between fixed top-0 left-0'>
      <div className='flex gap-[20px] items-center'>
        <TiArrowLeft
          className='cursor-pointer'
          size={35}
          onClick={handleBack}
          role='button'
          tabIndex={0}
          aria-label='뒤로가기'
        />
        <button
          className='cursor-pointer font-semibold text-[16px]'
          onClick={handleHome}
          role='button'
          tabIndex={0}
          aria-label='홈으로 이동'
        >
          코스팔레트
        </button>
      </div>
      <div className='flex items-center gap-[10px]'>
        {session?.user.name ? (
          <UserProfile
            nickname={session.user.nickname!}
            profileImageUrl={session.user.profileImageUrl!}
          />
        ) : null}

        <IoMenu
          className='cursor-pointer'
          size={30}
          onClick={handleMenu}
          role='button'
          tabIndex={0}
          aria-label='메뉴 페이지로 이동'
        />
      </div>
    </header>
  );
}
