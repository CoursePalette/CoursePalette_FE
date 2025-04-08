'use client';

import { getHomeData } from '@/api/home';
import { useCategoryStore } from '@/store/course/useCategoryStore';
import { useSearchCourseStore } from '@/store/course/useSearchCourseStore';
import { useQuery } from '@tanstack/react-query';
import ReactDOMServer from 'react-dom/server';

import { useRouter } from 'next/navigation';

import { useEffect, useRef } from 'react';

import { truncateText } from '@/lib/utils';

import CustomPin from '../atoms/CustomPin';

// 지도는 CSR
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export default function Map() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const category = useCategoryStore((state) => state.selectedCategory);
  const search = useSearchCourseStore((state) => state.search);
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ['homeData', search, category],
    queryFn: () => getHomeData(search, category),
  });

  const places = data?.places || [];

  useEffect(() => {
    console.log('places :', places);
  }, [places]);

  useEffect(() => {
    // 스크립트가 로드 된 후 실행하자
    if (!window.kakao || !window.kakao.maps) {
      return;
    }

    // auto load false이기에 sdk가 준비되면 콜백 안에서 지도 객체를 생성해야함.
    window.kakao.maps.load(() => {
      const container = mapContainerRef.current;
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울시청 좌표
        level: 8, // 확대 레벨 (값이 작을수록 더 확대됨)
      };

      const map = new window.kakao.maps.Map(container, options);

      places.forEach((place) => {
        const pinId = `custom-pin-${place.placeId}`;

        const content = getPinHtml(
          place.name,
          place.address,
          pinId,
          `/place/${place.placeId}`
        );

        const position = new window.kakao.maps.LatLng(
          place.latitude,
          place.longitude
        );
        new window.kakao.maps.CustomOverlay({
          map,
          position,
          content,
          yAnchor: 1, // 핀의 아래쪽 끝을 기준으로 오버레이 위치 설정 옵션
        });
      });
    });
  }, [places]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 클릭한 요소 또는 그 조상 중 data-route 속성이 있는지 찾음
      const target = (e.target as HTMLElement).closest('[data-route]');
      if (target) {
        const route = target.getAttribute('data-route');
        if (route) {
          router.push(route);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [router]);

  return <div ref={mapContainerRef} id='map' className='w-full h-screen' />;
}

// 커스텀 핀 HTML을 직접 반환하는 헬퍼 함수
// 기존에는 SSR로 렌더링 했는데 클라이언트 컴포넌트다 보니 CSR 이 더 효과적이다
function getPinHtml(
  title: string,
  address: string,
  pinId: string,
  route: string
) {
  return `
    <div id="${pinId}" data-route="${route}" class="map-pin" 
         style="display: flex; flex-direction: column; align-items: center; z-index: 500; cursor: pointer;">
      <div style="display: flex; flex-direction: column; width: 100px; height: 40px; border-radius: 5px; 
                  border: 1px solid #D3E4FF; font-size: 10px; overflow: hidden;">
        <p style="color: #0064FF; text-align: center; background-color: #D3E4FF; 
                  width: 100%; height: 20px; line-height: 20px;">
          ${truncateText(title)}
        </p>
        <p style="color: black; text-align: center; background-color: white; 
                  width: 100%; height: 20px; line-height: 20px;">
          ${truncateText(address)}
        </p>
      </div>
      <img src="/images/pin.png" alt="map pin" style="width: 30px; height: 40px;" />
    </div>
  `;
}
