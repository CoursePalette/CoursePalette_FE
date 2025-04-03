import { getHomeData } from '@/api/home';
import HomeClient from '@/components/organisms/HomeClient';
import { QueryClient, dehydrate } from '@tanstack/react-query';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '코스팔레트 홈',
  description: '지도 기반 사용자 참여형 코스 추천 및 공유 플랫폼',
};

export default async function Home() {
  const queryClient = new QueryClient();

  // 기본 검색어 및 카테고리로 prefetch 진행
  await queryClient.prefetchQuery({
    queryKey: ['homeData', '', '전체'],
    queryFn: () => getHomeData('', '전체'),
  });

  // srr로 미리 불러온 상태를 dehydrate함
  const dehydratedState = dehydrate(queryClient);

  return <HomeClient dehydratedState={dehydratedState} />;
}
