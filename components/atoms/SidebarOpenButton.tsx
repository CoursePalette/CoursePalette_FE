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
  return (
    <motion.button
      onClick={toggle}
      animate={{ left: isOpen ? SIDEBAR_WIDTH : 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
      className='fixed top-[155px] !w-[50px] !h-[50px] bg-[#0064FF] hover:bg-[#0064FF]/90 flex items-center justify-center rounded-tr-[16px] rounded-br-[16px]'
    >
      {isOpen ? (
        <MdKeyboardArrowLeft className='!w-[40px] !h-[40px] text-white' />
      ) : (
        <MdKeyboardArrowRight className='!w-[40px] !h-[40px] text-white' />
      )}
    </motion.button>
  );
}
