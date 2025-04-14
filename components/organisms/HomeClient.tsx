'use client';

import { getHomeData } from '@/apis/home';
import { useCategoryStore } from '@/store/course/useCategoryStore';
import { useSearchCourseStore } from '@/store/course/useSearchCourseStore';
import { useInfoModalStore } from '@/store/modal/useInfoModalStore';
import { HomeResponseDto } from '@/types/Home';
import { HydrationBoundary, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import CourseCreateButton from '../atoms/CourseCreateButton';
import InfoModal from '../atoms/InfoModal';
import Loading from '../atoms/Loading';
import ModalHeader from '../atoms/ModalHeader';
import SidebarOpenButton from '../atoms/SidebarOpenButton';
import Categories from '../molecules/Categories';
import Map from '../molecules/Map';
import SideBar from '../molecules/SideBar';

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
  const { data: session, status } = useSession();
  const { isShown, closeModal } = useInfoModalStore();

  const { isLoading, isError } = useQuery<HomeResponseDto>({
    queryKey: ['homeData', search, category],
    queryFn: () => getHomeData(search, category),
  });

  if (isLoading) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <Loading />
      </div>
    );
  }
  if (isError) return <div>에러가 발생했습니다.</div>;

  return (
    <main className='w-full h-full relative'>
      {!session && status === 'unauthenticated' && isShown && (
        <InfoModal onClose={closeModal} />
      )}
      <ModalHeader />
      <Map />
      <Categories />
      <SideBar />
      <SidebarOpenButton />
      <CourseCreateButton />
    </main>
  );
}
