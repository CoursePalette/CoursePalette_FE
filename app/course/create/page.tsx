'use client';

import { createCourse } from '@/api/course';
import CancleButton from '@/components/atoms/CancleButton';
import CategorySelect from '@/components/atoms/CategorySelect';
import PlaceSelect from '@/components/atoms/PlaceSelect';
import RegisterButton from '@/components/atoms/RegisterButton';
import TextInput from '@/components/atoms/TextInput';
import PlacesManage from '@/components/molecules/PlacesManage';
import { useCreateCourseStore } from '@/store/course/useCreateCourseStore';
import { CreateCourseRequestDto, CreateCourseResponse } from '@/types/\bCourse';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';

import { useCallback } from 'react';

export default function CourseCreatePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const title = useCreateCourseStore((state) => state.title);
  const setTitle = useCreateCourseStore((state) => state.setTitle);
  const category = useCreateCourseStore((state) => state.category);
  const setCategory = useCreateCourseStore((state) => state.setCategory);

  const places = useCreateCourseStore((state) => state.places);
  const reorderPlaces = useCreateCourseStore((state) => state.reorderPlaces);
  const clearPlaces = useCreateCourseStore((state) => state.clearPlaces);
  const removePlace = useCreateCourseStore((state) => state.removePlace);

  const canRegister = !!title.trim() && !!category.trim() && places.length >= 2;

  const mutation = useMutation({
    mutationFn: (courseData: CreateCourseRequestDto) =>
      createCourse(courseData),
    onSuccess: (data: CreateCourseResponse) => {
      console.log('코스 등록 성공', data);
      setTitle('');
      setCategory('');
      clearPlaces();
      alert('등록 완료! 코스 아이디는' + data.courseId);
    },
    onError: (error) => {
      console.error('코스 등록 실패', error);
      alert('코스 등록 중 오류 발생');
    },
  });

  const handleCancle = useCallback(() => {
    setTitle('');
    setCategory('');
    clearPlaces();
    router.back();
  }, [clearPlaces, router, setCategory, setTitle]);

  const handleRegister = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!canRegister) return;

      if (!session?.user?.backendJwt) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 백엔드에서 받는 형태로 변환
      const placeDtoList = places.map((p) => ({
        placeId: p.id,
        name: p.place_name,
        address: p.address_name,
        latitude: p.latitude,
        longitude: p.longitude,
        placeUrl: p.place_url,
        sequence: p.sequence,
      }));

      const body = {
        title,
        category,
        places: placeDtoList,
      };

      console.log('등록 실행 : ', body);
      mutation.mutate(body);
    },
    [canRegister, category, mutation, places, session?.user?.backendJwt, title]
  );

  return (
    <div className='w-full h-full flex justify-center pt-[50px] px-[20px]'>
      <div className='w-[365px] md:w-[700px]  flex flex-col'>
        <TextInput
          infoText={'코스 제목을 입력해주세요.'}
          placeholder={'ex) 혼자서 성수동 즐기는 코스'}
          value={title}
          setValue={setTitle}
        />
        <CategorySelect
          labelClassName='mt-[20px]'
          infoText={'코스 카테고리를 선택해주세요.'}
          placeholder={'코스 카테고리를 선택해주세요'}
          category={category}
          setCategory={setCategory}
        />

        <PlaceSelect className='mt-[20px]' />
        <PlacesManage
          places={places}
          reorderPlaces={reorderPlaces}
          removePlace={removePlace}
        />

        <div className='mt-[50px] w-full flex justify-between'>
          <CancleButton onClick={handleCancle} />
          <RegisterButton onClick={handleRegister} disabled={!canRegister} />
        </div>
      </div>
    </div>
  );
}
