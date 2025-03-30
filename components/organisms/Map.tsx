/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';

// 지도는 CSR

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map() {
  const mapContainerRef = useRef<HTMLDivElement>(null);

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
        level: 3, // 확대 레벨 (값이 작을수록 더 확대됨)
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const map = new window.kakao.maps.Map(container, options);
    });
  }, []);

  return <div ref={mapContainerRef} id='map' className='w-full h-full' />;
}
