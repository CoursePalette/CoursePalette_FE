'use client';

import { CourseSimpleDto } from '@/types/Course';
import { FaStar } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface CourseBoxProps {
  course: CourseSimpleDto;
}

export default function CourseBox({ course }: CourseBoxProps) {
  const router = useRouter();

  const handelRouting = () => {
    router.push(`/course/detail/${course.courseId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handelRouting();
    }
  };

  return (
    <div
      role='button'
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handelRouting}
      className='flex items-center justify-between px-[20px] w-[365px] h-[100px] rounded-[16px] border border-[#D1D5DC] hover:border-black cursor-pointer box-border'
    >
      <div className='flex flex-col'>
        <div className='flex items-center gap-[7px] pt-[10px]'>
          <Image
            src={course.user.profileImageUrl}
            width={30}
            height={30}
            className='rounded-full'
            alt='유저 프로필 사진'
          />
          <span className='text-[12px] font-normal'>
            {course.user.nickname}
          </span>
        </div>

        <p className='text-[15px] font-semibold mt-[5px]'>{course.title}</p>

        <div className='text-[14px] font-normal flex gap-[10px] items-center mt-[5px]'>
          <div className='flex gap-[3px] items-center'>
            <span>#</span>
            <span>{course.category}</span>
          </div>
          <div className='flex gap-[3px] items-center'>
            <FaStar size={12} className='pb-[1px]' />
            <span>{course.favorite}</span>
          </div>
        </div>
      </div>

      <MdKeyboardArrowRight className='!w-[30px] !h-[30px]' />
    </div>
  );
}
