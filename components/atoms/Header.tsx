'use client';

import { IoMenu } from 'react-icons/io5';
import { TiArrowLeft } from 'react-icons/ti';

export default function Header() {
  return (
    <div className='w-full h-[50px] bg-white/80 backdrop-blur-lg border-b border-black flex items-center px-[20px] justify-between fixed top-0 left-0'>
      <div className='flex gap-[20px] items-center'>
        <TiArrowLeft className='cursor-pointer' size={35} />
        <span className='cursor-pointer font-semibold text-[16px]'>
          코스팔레트
        </span>
      </div>
      <IoMenu className='cursor-pointer' size={30} />
    </div>
  );
}
