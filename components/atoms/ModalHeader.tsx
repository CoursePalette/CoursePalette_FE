'use client';

import { useSearchCourseStore } from '@/store/course/useSearchCourseStore';
import { IoMenu } from 'react-icons/io5';
import { MdSearch } from 'react-icons/md';

import { useRouter } from 'next/navigation';

import { useCallback } from 'react';

import { Input } from '../ui/input';

export default function ModalHeader() {
  const router = useRouter();
  const search = useSearchCourseStore((state) => state.search);
  const setSearch = useSearchCourseStore((state) => state.setSearch);
  // const clearSearch = useSearchCourseStore((state) => state.clearSearch);

  const handleHome = useCallback(() => {
    router.replace('/');
  }, [router]);

  const handleMenu = useCallback(() => {
    router.push('/menu');
  }, [router]);

  const handleSearch = useCallback(() => {
    console.log('입력값은 : ', search);
    // clearSearch();
  }, [search]);

  return (
    <div
      className='w-[calc(100%_-_20px)] min-w-[350px] max-w-[700px] md:w-[700px] h-[50px]
     rounded-[10px] backdrop-blur-3xl bg-white/80 flex items-center
     px-[10px] fixed top-[30px] left-1/2 transform -translate-x-1/2 z-50 shadow-lg gap-[20px]
     '
    >
      <span
        className='cursor-pointer font-semibold text-[16px]'
        onClick={handleHome}
        role='button'
        tabIndex={0}
      >
        코스팔레트
      </span>

      <div className='flex-1 flex gap-[5px] items-center shadow-none'>
        <Input
          className='flex-1'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='예) 성수동 데이트'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <MdSearch
          role='button'
          size={30}
          className='cursor-pointer'
          tabIndex={0}
          onClick={handleSearch}
        />
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
