'use client';

import { IoMenu } from 'react-icons/io5';
import { TiArrowLeft } from 'react-icons/ti';

import { useRouter } from 'next/navigation';

import { useCallback } from 'react';

export default function Header() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleHome = useCallback(() => {
    router.replace('/');
  }, [router]);

  const handleMenu = useCallback(() => {
    router.push('/menu');
  }, [router]);

  return (
    <div className='w-full h-[50px] bg-white/80 backdrop-blur-lg border-b border-black flex items-center px-[20px] justify-between fixed top-0 left-0'>
      <div className='flex gap-[20px] items-center'>
        <TiArrowLeft
          className='cursor-pointer'
          size={35}
          onClick={handleBack}
          role='button'
          tabIndex={0}
        />
        <span
          className='cursor-pointer font-semibold text-[16px]'
          onClick={handleHome}
          role='button'
          tabIndex={0}
        >
          코스팔레트
        </span>
      </div>
      <IoMenu
        className='cursor-pointer'
        size={30}
        onClick={handleMenu}
        role='button'
        tabIndex={0}
      />
    </div>
  );
}
