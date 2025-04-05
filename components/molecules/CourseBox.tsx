'use client';

import { deleteCourse } from '@/api/course';
import { useCourseEditStore } from '@/store/course/useCourseEditStore';
import { CourseSimpleDto } from '@/types/Course';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaStar } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import Swal from 'sweetalert2';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import DeleteButton from '../atoms/DeleteButton';
import EditButton from '../atoms/EditButton';

export interface CourseBoxProps {
  course: CourseSimpleDto;
}

export default function CourseBox({ course }: CourseBoxProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const isMyCourse = pathname.includes('/mycourse');

  const isEdit = useCourseEditStore((state) => state.isEdit);

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: (data) => {
      if (data.message === '코스를 성공적으로 삭제했습니다!') {
        Swal.fire({
          title: '코스 삭제 완료',
          text: '코스를 성공적으로 삭제했습니다!',
          icon: 'success',
        });
        // 삭제 성공 시 myCourses 쿼리 무효
        queryClient.invalidateQueries({ queryKey: ['myCourses'] });
      } else {
        Swal.fire({
          title: '코스 삭제 실패',
          text: data.message,
          icon: 'error',
        });
      }
    },
    onError: () => {
      Swal.fire({
        title: '코스 삭제 실패',
        text: '서버 요청 중 오류가 발생했습니다.',
        icon: 'error',
      });
    },
  });

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
      aria-label={`${course.title} 코스 상세보기`}
      className='flex items-center justify-between px-[20px] w-[365px] h-[100px] rounded-[16px] border border-[#D1D5DC] hover:border-black cursor-pointer box-border'
    >
      <div className='flex flex-col'>
        <div className='flex items-center gap-[7px] pt-[10px]'>
          <Image
            src={course.user.profileImageUrl}
            width={30}
            height={30}
            className='rounded-full'
            alt={`${course.user.nickname}의 프로필 사진`}
          />
          <span className='text-[12px] font-normal'>
            {course.user.nickname}
          </span>
        </div>

        <p className='text-[15px] font-semibold mt-[5px]'>{course.title}</p>

        <div className='text-[14px] font-normal flex gap-[10px] items-center mt-[5px]'>
          <div className='flex gap-[3px] items-center'>
            <span aria-hidden>#</span>
            <span aria-label='카테고리'>{course.category}</span>
          </div>
          <div className='flex gap-[3px] items-center'>
            <FaStar size={12} className='pb-[1px]' />
            <span aria-label='즐겨찾기 수'>{course.favorite}</span>
          </div>
        </div>
      </div>
      {isEdit ? (
        isMyCourse ? (
          <div className='flex flex-col gap-[10px]'>
            <EditButton
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
            <DeleteButton
              onClick={async (e) => {
                e.stopPropagation();
                deleteMutation.mutate({ courseId: course.courseId });
              }}
            />
          </div>
        ) : (
          <DeleteButton
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )
      ) : (
        <MdKeyboardArrowRight aria-hidden className='!w-[30px] !h-[30px]' />
      )}
    </div>
  );
}
