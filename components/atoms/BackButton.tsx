'use client';

import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      aria-label='뒤로가기 버튼'
      tabIndex={0}
      onClick={router.back}
      className='w-[125px] md:w-[150px] h-[40px] bg-[#202632]/80 text-white absolute -top-[50px] left-0 rounded-[30px]'
    >
      뒤로가기
    </Button>
  );
}
