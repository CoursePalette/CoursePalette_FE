import { getPlaceWithCourses } from '@/api/place';
import CourseBox from '@/components/atoms/CourseBox';
import PlaceDetailButton from '@/components/atoms/PlaceDetailButton';

import { Metadata } from 'next';

interface PlacePageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: '코스팔레트 장소 상세 페이지',
  description:
    '지도 기반 사용자 참여형 코스 추천 및 공유 플랫폼 코스팔레트의 장소 상세 페이지',
};

export default async function PlacePage({ params }: PlacePageProps) {
  const { id } = params;
  const data = await getPlaceWithCourses({ placeId: id });
  console.log('PlacePage, data: ', data);

  return (
    <div className='w-full h-full pt-[100px] flex flex-col items-center'>
      <div className='flex flex-col gap-[20px] items-center'>
        <p className='text-[24px] font-semibold'>{data.name}</p>
        <p className='text-[16px]'>{data.address}</p>
        <PlaceDetailButton placeUrl={data.placeUrl} />
      </div>
      <div className='w-full max-w-[768px] mt-[50px] py-[20px] grid grid-cols-1 md:grid-cols-2 justify-items-center gap-[20px]'>
        {data?.courses.map((course, idx) => (
          <CourseBox key={idx} course={course} />
        ))}
        {data?.courses.map((course, idx) => (
          <CourseBox key={idx} course={course} />
        ))}
        {data?.courses.map((course, idx) => (
          <CourseBox key={idx} course={course} />
        ))}
        {data?.courses.map((course, idx) => (
          <CourseBox key={idx} course={course} />
        ))}
        {data?.courses.map((course, idx) => (
          <CourseBox key={idx} course={course} />
        ))}
        {data?.courses.map((course, idx) => (
          <CourseBox key={idx} course={course} />
        ))}
        {data?.courses.map((course, idx) => (
          <CourseBox key={idx} course={course} />
        ))}
        {data?.courses.map((course, idx) => (
          <CourseBox key={idx} course={course} />
        ))}
      </div>
    </div>
  );
}
