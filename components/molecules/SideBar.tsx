'use client';

import { getHomeData } from '@/api/home';
import { useCategoryStore } from '@/store/course/useCategoryStore';
import { useSearchCourseStore } from '@/store/course/useSearchCourseStore';
import { useSidebarStore } from '@/store/sidebar/useSidebarStore';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { MdKeyboardArrowLeft } from 'react-icons/md';

import { useEffect } from 'react';

const SIDEBAR_WIDTH = 375;

export default function SideBar() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggle = useSidebarStore((state) => state.toggle);
  const category = useCategoryStore((state) => state.selectedCategory);
  const search = useSearchCourseStore((state) => state.search);

  const { data } = useQuery({
    queryKey: ['homeData', search, category],
    queryFn: () => getHomeData(search, category),
  });

  const courses = data?.courses || [];

  useEffect(() => {
    console.log('courses : ', courses);
  }, [courses]);

  return (
    <motion.aside
      id='sidebar'
      className='w-[375px] h-full bg-white fixed left-[-375px] top-0 z-[50] py-[20px]'
      animate={{ x: isOpen ? SIDEBAR_WIDTH : 0 }}
      transition={{ type: 'tween', duration: 0.3 }}
      aria-hidden={!isOpen} // 열리지 않았다면 스크린 리더가 건너뛰도록..
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
    </motion.aside>
  );
}
