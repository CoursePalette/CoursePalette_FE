'use client';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceDtoWithSequence } from '@/types/Place';

import { useEffect, useState } from 'react';

import BackButton from '../atoms/BackButton';
import FavoriteButton from '../atoms/FavoriteButton';
import PlaceDetailButton from '../atoms/PlaceDetailButton';

interface PlaceSlideProps {
  places: PlaceDtoWithSequence[];
  setCurrentSlide: (index: number) => void;
}

export default function PlaceSlide({
  places,
  setCurrentSlide,
}: PlaceSlideProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!api) return;
    const handleSelect = () => {
      const currentIndex = api.selectedScrollSnap();
      setCurrentSlide(currentIndex);
    };

    api.on('select', handleSelect);

    return () => {
      api.off('select', handleSelect);
    };
  }, [api, setCurrentSlide]);

  return (
    <div
      className='fixed bottom-[20px] md:bottom-[50px] left-1/2 -translate-x-1/2 z-50'
      role='region'
      aria-label='장소 슬라이드 목록'
    >
      <BackButton />
      <FavoriteButton />
      <Carousel
        setApi={setApi}
        className='w-[275px] md:w-[375px] h-[200px] bg-white rounded-[16px] shadow-lg '
        aria-live='polite'
      >
        <CarouselContent>
          {places.map((place, idx) => (
            <CarouselItem
              key={place.placeId}
              aria-label={`${idx + 1}번째 장소: ${place.name}`}
            >
              <div className='w-full h-full flex flex-col items-center p-[10px]'>
                <div className='w-full h-[30px]'>
                  <div
                    className='w-[30px] h-[30px] bg-[#0064FF] rounded-full flex items-center justify-center'
                    aria-hidden='true'
                  >
                    <span className='text-white text-[20px] font-semibold'>
                      {place.sequence}
                    </span>
                  </div>
                </div>
                <p
                  className='text-center text-[18px] md:text-[20px] font-semibold'
                  aria-label={`장소 이름: ${place.name}`}
                >
                  {place.name}
                </p>
                <p
                  className='text-center text-[14px] md:text-[16px] font-medium mt-[7px] mb-[7px]'
                  aria-label={`주소: ${place.address}`}
                >
                  {place.address}
                </p>
                <PlaceDetailButton placeUrl={place.placeUrl} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious aria-label='이전 장소 보기' />
        <CarouselNext aria-label='다음 장소 보기' />
      </Carousel>
    </div>
  );
}
