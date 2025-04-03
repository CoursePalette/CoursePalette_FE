// import PlaceDetailButton from '@/components/atoms/PlaceDetailButton';
'use client';

import { getPlaceWithCourses } from '@/api/place';

import { useEffect } from 'react';

// import PlaceDetailButton from '@/components/atoms/PlaceDetailButton';

interface PlacePageProps {
  params: { id: string };
}

export default function PlacePage({ params }: PlacePageProps) {
  const { id } = params;

  const fetch = async () => {
    const result = await getPlaceWithCourses({ placeId: id });
    console.log('getPlaceWithCourses : ', result);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className='pt-[100px]'>
      <div>
        <p></p>
      </div>
      {/* <PlaceDetailButton /> */}
    </div>
  );
}
