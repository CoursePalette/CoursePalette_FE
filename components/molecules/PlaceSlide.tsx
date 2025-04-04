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
    <Carousel
      setApi={setApi}
      className='w-[275px] md:w-[375px] h-[200px] bg-white rounded-[16px] shadow-lg flex fixed bottom-[20px] md:bottom-[50px] left-1/2 transform -translate-x-1/2 z-50'
    >
      <CarouselContent>
        {places.map((place, idx) => (
          <CarouselItem key={idx}>
            <div className='w-full h-full flex flex-col items-center p-[10px]'>
              <div className='w-full h-[30px]'>
                <div className='w-[30px] h-[30px] bg-[#0064FF] rounded-full flex items-center justify-center'>
                  <span className='text-white text-[20px] font-semibold'>
                    {place.sequence}
                  </span>
                </div>
              </div>
              <p className='text-center text-[18px] md:text-[20px] font-semibold'>
                {place.name}
              </p>
              <p className='text-center text-[14px] md:text-[16px] font-medium mt-[7px] mb-[7px]'>
                {place.address}
              </p>
              <PlaceDetailButton placeUrl={place.placeUrl} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
