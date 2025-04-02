'use client';

import { useSidebarStore } from '@/store/sidebar/useSidebarStore';
import { motion } from 'motion/react';
import { MdKeyboardArrowLeft } from 'react-icons/md';

const SIDEBAR_WIDTH = 375;

export default function SideBar() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggle = useSidebarStore((state) => state.toggle);
  return (
    <motion.div
      className='w-[375px] h-full bg-white fixed left-0 top-0 z-[50] py-[20px]'
      animate={{ x: isOpen ? 0 : -SIDEBAR_WIDTH }}
      transition={{ type: 'tween', duration: 0.3 }}
    >
      <div className='flex px-[20px]'>
        <p className='text-[20px] font-semibold flex-1 text-center'>
          현재 표시된 코스
        </p>
        <MdKeyboardArrowLeft
          role='button'
          className='cursor-pointer w-[30px] h-[30px]'
          onClick={toggle}
        />
      </div>
    </motion.div>
  );
}
