'use client';

import { PlaceDtoWithSequence } from '@/types/Place';
import ReactDOMServer from 'react-dom/server';

import { useEffect, useRef } from 'react';

import CustomPin from '../atoms/CustomPin';

/* eslint-disable @typescript-eslint/no-explicit-any */

// 지도는 CSR
declare global {
  interface Window {
    kakao: any;
  }
}

interface CourseDetailMapProps {
  places: PlaceDtoWithSequence[];
  currentIndex: number;
}

export default function CourseDetailMap({
  places,
  currentIndex,
}: CourseDetailMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // 스크립트가 로드 된 후 실행하자
    if (!window.kakao || !window.kakao.maps || !places || places.length === 0) {
      return;
    }

    // auto load false이기에 sdk가 준비되면 콜백 안에서 지도 객체를 생성해야함.
    window.kakao.maps.load(() => {
      const container = mapContainerRef.current;
      if (!container) return;

      const bounds = new window.kakao.maps.LatLngBounds();

      const options = {
        center: new window.kakao.maps.LatLng(
          parseFloat(places[0].latitude),
          parseFloat(places[0].longitude)
        ),
        level: 5,
      };

      mapRef.current = new window.kakao.maps.Map(container, options);

      const path: any[] = [];

      places.forEach((place) => {
        const pinId = `custom-pin-${place.placeId}`;

        const content = ReactDOMServer.renderToString(
          <CustomPin
            title={place.name}
            route={`/place/${place.placeId}`}
            id={pinId}
            address={place.address}
          />
        );

        const position = new window.kakao.maps.LatLng(
          place.latitude,
          place.longitude
        );

        path.push(position);
        bounds.extend(position); // 영역에 추가

        new window.kakao.maps.CustomOverlay({
          map: mapRef.current,
          position,
          content,
          yAnchor: 1, // 핀의 아래쪽 끝을 기준으로 오버레이 위치 설정 옵션
        });
      });

      const polyline = new window.kakao.maps.Polyline({
        path,
        strokeWeight: 3,
        strokeColor: '#0064FF',
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
      });

      polyline.setMap(mapRef.current);
      mapRef.current.setBounds(bounds); // 계산된 영역으로 줌 및 위치 조정
    });
  }, [places]);

  useEffect(() => {
    if (mapRef.current && places[currentIndex]) {
      const moveLatLng = new window.kakao.maps.LatLng(
        places[currentIndex].latitude,
        places[currentIndex].longitude
      );
      mapRef.current.panTo(moveLatLng);
    }
  }, [currentIndex, places]);

  return (
    <div
      ref={mapContainerRef}
      id='courseDetailMap'
      className='w-full h-screen'
    />
  );
}
