'use client';

import { useSidebarStore } from '@/store/sidebar/useSidebarStore';
import { motion } from 'motion/react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { MdKeyboardArrowLeft } from 'react-icons/md';

import { Button } from '../ui/button';

const SIDEBAR_WIDTH = 375;

export default function SidebarOpenButton() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggle = useSidebarStore((state) => state.toggle);
  const ariaLabel = isOpen ? '사이드바 닫기' : '사이드바 열기';

  return (
    <motion.button
      onClick={toggle}
      animate={{ left: isOpen ? SIDEBAR_WIDTH : 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      className='fixed top-[155px] !w-[50px] !h-[50px] bg-[#0064FF] hover:bg-[#0064FF]/90 flex items-center justify-center rounded-tr-[16px] rounded-br-[16px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
    >
      {isOpen ? (
        <MdKeyboardArrowLeft className='!w-[40px] !h-[40px] text-white' />
      ) : (
        <MdKeyboardArrowRight className='!w-[40px] !h-[40px] text-white' />
      )}
    </motion.button>
  );
}
