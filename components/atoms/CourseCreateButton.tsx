'use client';

import { FaPlus } from 'react-icons/fa';

import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';

export default function CourseCreateButton() {
  const router = useRouter();

  return (
    <Button
      className='!w-[50px] !h-[50px] md:!w-[75px] md:!h-[75px] bg-[#0064FF] hover:bg-[#D3E4FF] text-white hover:text-[#0064FF] flex items-center justify-center
      fixed bottom-[60px] right-[20px] md:bottom-[60px] md:right-[55px] rounded-full
    '
      onClick={() => router.push('/course/create')}
      tabIndex={0}
      aria-label='코스 생성 버튼'
    >
      <FaPlus className='!w-[24px] !h-[24px] md:!w-[30px] md:!h-[30px]' />
    </Button>
  );
}
