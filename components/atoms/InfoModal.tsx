'use client';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { IoIosClose } from 'react-icons/io';

import Image from 'next/image';

import { useEffect, useState } from 'react';

interface InfoModal {
  onClose: () => void;
}

export default function InfoModal({ onClose }: InfoModal) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const info = [
    {
      text: `지도 기반 사용자 참여형 코스 추천 및 공유 플랫폼 \n코스팔레트에 오신 걸 환영해요!`,
      image: '/images/logo.png',
    },
    {
      text: `지도에서 유저들이 등록한 \n다양한 장소들을 한눈에 볼 수 있어요!`,
      image: '/images/info1.png',
    },
    {
      text: `지도 왼쪽 상단의 라벨을 클릭하면 \n현재 지도의 코스 목록을 확인할 수 있어요!`,
      image: '/images/info2.png',
    },
    {
      text: `태그와 검색 기능으로 \n원하는 코스만 골라볼 수 있어요!`,
      image: '/images/info3.png',
    },
    {
      text: `장소 핀을 클릭하면 장소의 정보와 \n이 장소가 포함된 코스들을 볼 수 있어요!`,
      image: '/images/info4.png',
    },
    {
      text: `코스의 장소들을 방문 순서대로 확인해 보세요! \n마음에 드는 코스는 즐겨찾기해 두세요!`,
      image: '/images/info5.png',
    },
    {
      text: `메뉴 탭에서 내가 등록한 코스와 \n즐겨찾기한 코스를 한 번에 관리할 수 있어요!`,
      image: '/images/info6.png',
    },
    {
      text: `나만의 멋진 코스를 공유해 보세요! \n좋아하는 장소를 방문 순서대로 등록하면 완성!`,
      image: '/images/info7.png',
    },
    {
      text: `코스팔레트의 주요 기능은 로그인이 필요해요! \n로그인 후 프로필 사진과 닉네임을 \n자유롭게 설정할 수 있어요.`,
      image: '/images/info8.png',
    },
  ];

  useEffect(() => {
    if (carouselApi) {
      // api의 on("select") 이벤트를 구독해서 현재 인덱스를 업데이트
      carouselApi.on('select', () => {
        const index = carouselApi.selectedScrollSnap();
        setCurrentIndex(index);
      });
      // 초기 인덱스 설정
      setCurrentIndex(carouselApi.selectedScrollSnap());
    }
  }, [carouselApi]);

  return (
    <div
      role='dialog'
      aria-modal='true'
      className='fixed inset-0 z-[500] flex items-center justify-center '
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='relative  w-[375px] h-full max-h-[742px] flex flex-col bg-[#0064FF] p-[10px] gap-[20px]'
      >
        <button aria-label='닫기' className='ml-auto' onClick={onClose}>
          <IoIosClose color='white' size={32} />
        </button>

        <Carousel
          setApi={setCarouselApi}
          className='w-[355px]  flex flex-col cursor-grab'
        >
          <CarouselContent>
            {info.map((item, index) => (
              <CarouselItem key={index} className='flex flex-col items-center'>
                {item.text.split('\n').map((line, idx) => (
                  <p
                    key={idx}
                    className='text-center text-[18px] text-white font-semibold'
                  >
                    {line}
                  </p>
                ))}
                <Image
                  src={item.image}
                  className='mt-[20px]'
                  alt={`정보 ${index + 1}`}
                  width={230!}
                  height={500!}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className='flex justify-center gap-2'>
          {info.map((_, idx) => (
            <button
              key={idx}
              className={`w-2.5 h-2.5 rounded-full  ${currentIndex === idx ? 'bg-white' : 'bg-gray-300'}`}
              aria-label={`슬라이드 ${idx + 1} ${currentIndex === idx ? ' (현재 슬라이드)' : ''}`}
              onClick={() => {
                if (carouselApi) {
                  carouselApi.scrollTo(idx);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
