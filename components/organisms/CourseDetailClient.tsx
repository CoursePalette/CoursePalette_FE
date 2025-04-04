'use client';

import { PlaceDtoWithSequence } from '@/types/Place';

import { useState } from 'react';

import CourseDetailMap from '../molecules/CourseDetailMap';
import PlaceSlide from '../molecules/PlaceSlide';

interface CourseDetailClientProps {
  places: PlaceDtoWithSequence[];
  courseId: number;
}

export default function CourseDetailClient({
  places,
  courseId,
}: CourseDetailClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <CourseDetailMap places={places} currentIndex={currentSlide} />
      <PlaceSlide
        places={places}
        setCurrentSlide={setCurrentSlide}
        courseId={courseId}
      />
    </>
  );
}
