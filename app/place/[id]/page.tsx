import { getPlaceWithCourses } from '@/apis/place';
import PlaceDetailButton from '@/components/atoms/PlaceDetailButton';
import CourseBox from '@/components/molecules/CourseBox';

import { Metadata } from 'next';

import Script from 'next/script';

interface PlacePageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PlacePageProps): Promise<Metadata> {
  const id = params.id;
  try {
    const data = await getPlaceWithCourses({ placeId: id });
    const title = `${data.name} 장소의 코스 | 코스팔레트`;
    const description = `코스팔레트에서 ${data.name}장소의 코스 ${data.courses
      .map((c) => c.title)
      .slice(0, 3)
      .join(', ')} 등을 확인해보세요!`;
    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
      },
    };
  } catch (error) {
    console.error('메타데이터 설정 중 오류', error);
    return {
      title: '코스팔레트 장소 상세 페이지',
      description:
        '지도 기반 사용자 참여형 코스 추천 및 공유 플랫폼 코스팔레트의 장소 상세 페이지',
    };
  }
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { id } = params;
  const data = await getPlaceWithCourses({ placeId: id });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: data.name,
    description: `코스팔레트에서 ${data.name} 장소를 기반으로 추천 코스: ${data.courses
      .map((c) => c.title)
      .join(', ')} 을(를) 확인해보세요.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.latitude,
      longitude: data.longitude,
    },
    url: data.placeUrl,
  };

  return (
    <main className='w-full h-full pt-[100px] flex flex-col items-center'>
      <Script
        id={`place-${id}-jsonld`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className='flex flex-col gap-[20px] items-center'>
        <h1 className='text-[24px] font-semibold'>{data.name}</h1>
        <p className='text-[16px]'>{data.address}</p>
        <PlaceDetailButton placeUrl={data.placeUrl} />
      </header>
      <section className='w-full max-w-[768px] mt-[50px] py-[20px] grid grid-cols-1 md:grid-cols-2 justify-items-center gap-[20px]'>
        {data?.courses.map((course, idx) => (
          <CourseBox key={idx} course={course} />
        ))}
      </section>
    </main>
  );
}
