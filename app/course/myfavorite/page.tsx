'use client';

import { getMyFavoriteCourses } from '@/apis/course';
import EditToggleButton from '@/components/atoms/EditToggleButton';
import Loading from '@/components/atoms/Loading';
import CourseBox from '@/components/molecules/CourseBox';
import { useCourseEditStore } from '@/store/course/useCourseEditStore';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { checkLogin } from '@/lib/checkLogin';

export default function MyFavoritePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.backendJwt) {
      checkLogin(router);
    }
  }, [router, session?.user?.backendJwt, status]);

  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['myFavorite'],
    queryFn: getMyFavoriteCourses,
  });

  const setIsEdit = useCourseEditStore((state) => state.setIsEdit);

  useEffect(() => {
    return () => {
      setIsEdit(false);
    };
  }, [setIsEdit]);

  if (isLoading)
    return (
      <div className='w-full h-full flex justify-center items-center '>
        <Loading />
      </div>
    );
  if (isError) return <div>에러 발생</div>;

  return (
    <main className='w-full h-full pt-[80px] flex flex-col items-center'>
      <h1 className='text-[32px] font-semibold'>내가 즐겨찾기한 코스</h1>
      <div className='w-full max-w-[768px] px-[20px] flex justify-end mt-[20px]'>
        <EditToggleButton />
      </div>
      {courses?.length === 0 && (
        <p className='w-full text-center mt-[100px] text-[20px] text-[#0064FF] font-semibold'>
          즐겨찾기한 코스가 없습니다.
        </p>
      )}
      <section className='grid w-full max-w-[768px] grid-cols-1 md:grid-cols-2 justify-items-center gap-[20px] mt-[20px]'>
        {courses?.map((course) => (
          <CourseBox key={course.courseId} course={course} />
        ))}
      </section>
    </main>
  );
}
