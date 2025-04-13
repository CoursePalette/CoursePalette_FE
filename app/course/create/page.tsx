'use client';

import { createCourse } from '@/apis/course';
import CancelButton from '@/components/atoms/CancelButton';
import CategorySelect from '@/components/atoms/CategorySelect';
import PlaceSelect from '@/components/atoms/PlaceSelect';
import RegisterButton from '@/components/atoms/RegisterButton';
import TextInput from '@/components/atoms/TextInput';
import PlacesManage from '@/components/molecules/PlacesManage';
import { useCreateCourseStore } from '@/store/course/useCreateCourseStore';
import {
  CreateCourseRequestDto,
  CreateCourseResponseDto,
} from '@/types/Course';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

import { useRouter } from 'next/navigation';

import { useCallback, useEffect } from 'react';

import { checkLogin } from '@/lib/checkLogin';

export default function CourseCreatePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.backendJwt) {
      checkLogin(router);
    }
  }, [router, session?.user?.backendJwt, status]);

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
    onSuccess: (data: CreateCourseResponseDto) => {
      console.log('코스 등록 성공', data);
      setTitle('');
      setCategory('');
      clearPlaces();
      Swal.fire({
        title: '등록 완료',
        text: `코스가 성공적으로 등록되었습니다!`,
        icon: 'success',
      }).then((result) => {
        if (
          result.isConfirmed ||
          result.dismiss === Swal.DismissReason.backdrop
        ) {
          router.push('/');
        }
      });
    },
    onError: (error) => {
      console.error('코스 등록 실패', error);
      Swal.fire('오류', '코스 등록 중 오류 발생', 'error');
    },
  });

  // 상태 초기화..
  useEffect(() => {
    return () => {
      setTitle('');
      setCategory('');
      clearPlaces();
    };
  }, [clearPlaces, setCategory, setTitle]);

  const handleCancel = useCallback(() => {
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
        checkLogin(router);
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
    [
      canRegister,
      category,
      mutation,
      places,
      router,
      session?.user?.backendJwt,
      title,
    ]
  );

  return (
    <form className='w-full h-full flex flex-col items-center justify-center pt-[100px] px-[20px] pb-[20px]'>
      <h1 className='text-[24px] font-semibold'>코스 등록 페이지</h1>
      <fieldset className='w-[365px] md:w-[700px]  flex flex-col mt-[20px]'>
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
          <CancelButton onClick={handleCancel} />
          <RegisterButton onClick={handleRegister} disabled={!canRegister} />
        </div>
      </fieldset>
    </form>
  );
}
