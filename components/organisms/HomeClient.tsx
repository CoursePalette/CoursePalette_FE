'use client';

import { getHomeData } from '@/api/home';
import { useCategoryStore } from '@/store/course/useCategoryStore';
import { useSearchCourseStore } from '@/store/course/useSearchCourseStore';
import { HydrationBoundary, useQuery } from '@tanstack/react-query';

import CourseCreateButton from '../atoms/CourseCreateButton';
import ModalHeader from '../atoms/ModalHeader';
import SidebarOpenButton from '../atoms/SidebarOpenButton';
import Categories from '../molecules/Categories';
import SideBar from '../molecules/SideBar';
import Map from './Map';

interface HomeClientProps {
  dehydratedState: unknown;
}

export default function HomeClient({ dehydratedState }: HomeClientProps) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeClientInner />
    </HydrationBoundary>
  );
}

function HomeClientInner() {
  const search = useSearchCourseStore((state) => state.search);
  const category = useCategoryStore((state) => state.selectedCategory);

  const { isLoading, isError } = useQuery({
    queryKey: ['homeData', search, category],
    queryFn: () => getHomeData(search, category),
  });

  if (isLoading) return <div>로딩중....</div>;
  if (isError) return <div>에러가 발생했습니다.</div>;

  return (
    <main className='w-full h-full relative'>
      <ModalHeader />
      <Map />
      <Categories />
      <SideBar />
      <SidebarOpenButton />
      <CourseCreateButton />
    </main>
  );
}
