import { getHomeData } from '@/apis/home';

import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://course-palette.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  //  정적 페이지(Static Pages) 설정
  // 검색 엔진에 노출시키고 싶은, 주소가 고정된 페이지들을 정의
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`, // 홈페이지
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const homeData = await getHomeData('', '전체'); // 검색어 없고, 카테고리 '전체'

    // 가져온 코스 데이터로 사이트맵 항목 생성
    const coursePages = homeData.courses.map((course) => ({
      url: `${BASE_URL}/course/detail/${course.courseId}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

    // 가져온 장소 데이터로 사이트맵 항목 생성
    const placePages = homeData.places.map((place) => ({
      url: `${BASE_URL}/place/${place.placeId}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }));

    dynamicPages = [...coursePages, ...placePages];
  } catch (error) {
    console.error(
      'Sitemap: Failed to fetch home data for dynamic pages:',
      error
    );
    // 홈 데이터 로딩 실패 시 동적 페이지는 비어있게 됩니다.
  }

  //  모든 페이지 목록을 합쳐서 반환
  return [...staticPages, ...dynamicPages];
}
