'use client';

import { getCourseEditData, updateCourse } from '@/api/course';
import CancelButton from '@/components/atoms/CancelButton';
import CategorySelect from '@/components/atoms/CategorySelect';
import Loading from '@/components/atoms/Loading';
import PlaceSelect from '@/components/atoms/PlaceSelect';
import RegisterButton from '@/components/atoms/RegisterButton';
import TextInput from '@/components/atoms/TextInput';
import PlacesManage from '@/components/molecules/PlacesManage';
import { useCreateCourseStore } from '@/store/course/useCreateCourseStore';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { checkLogin } from '@/lib/checkLogin';

export default function CourseEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const courseId = Number(params.id);
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);

  const title = useCreateCourseStore((state) => state.title);
  const setTitle = useCreateCourseStore((state) => state.setTitle);

  const category = useCreateCourseStore((state) => state.category);
  const setCategory = useCreateCourseStore((state) => state.setCategory);

  const places = useCreateCourseStore((state) => state.places);
  const clearPlaces = useCreateCourseStore((state) => state.clearPlaces);
  const addPlace = useCreateCourseStore((state) => state.addPlace);
  const reorderPlaces = useCreateCourseStore((state) => state.reorderPlaces);
  const removePlace = useCreateCourseStore((state) => state.removePlace);
  const canRegister = !!title.trim() && !!category.trim() && places.length >= 2;

  // 로그인 췤
  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.backendJwt) {
      checkLogin(router);
    }
  }, [session, status, router]);

  // 페이지 벗어나면 상태 초기화.
  useEffect(() => {
    return () => {
      setTitle('');
      setCategory('');
      clearPlaces();
    };
  }, [clearPlaces, setCategory, setTitle]);

  // 초기 데이터
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.backendJwt) return;
      setLoading(true);
      try {
        const data = await getCourseEditData(courseId);
        setTitle(data.title);
        setCategory(data.category);
        clearPlaces();

        // 원래 순서대로
        const sortedPlaces = data.places.sort(
          (a, b) => a.sequence - b.sequence
        );
        sortedPlaces.forEach((p) => {
          addPlace({
            id: p.placeId,
            place_name: p.name,
            address_name: p.address,
            latitude: p.latitude,
            longitude: p.longitude,
            place_url: p.placeUrl,
          });
        });

        setLoading(false);
      } catch (error) {
        console.error('코스 수정 데이터 불러오기 실패', error);
        Swal.fire(
          '데이터 불러오기 실패',
          '코스 정보를 불러오지 못했습니다.',
          'error'
        ).then(() => {
          router.back();
        });
      }
    };
    fetchData();
  }, [
    addPlace,
    clearPlaces,
    courseId,
    router,
    session?.user?.backendJwt,
    setCategory,
    setTitle,
  ]);

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!title.trim() || !category.trim() || places.length < 2) {
      Swal.fire(
        '알림',
        '제목, 카테고리, 장소 (2개 이상) 채워주세요!',
        'warning'
      );
      return;
    }

    const body = {
      title,
      category,
      places: places.map((p) => ({
        placeId: p.id,
        name: p.place_name,
        address: p.address_name,
        latitude: p.latitude,
        longitude: p.longitude,
        placeUrl: p.place_url,
        sequence: p.sequence,
      })),
    };

    try {
      const result = await updateCourse(courseId, body);
      if (result.message === '코스 수정 완료') {
        Swal.fire('완료', '코스가 수정되었습니다.', 'success').then(() => {
          router.replace('/course/mycourse');
        });
      } else {
        Swal.fire('오류', result.message, 'error');
      }
    } catch (error) {
      console.log('코스 수정 실패', error);
      Swal.fire('오류', '코스 수정 중 오류 발생', 'error');
    }
  };

  if (loading)
    return (
      <div className='w-full h-full flex justify-center items-center '>
        <Loading />
      </div>
    );

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className='w-full h-full flex flex-col items-center pt-[100px] px-[20px] pb-[20px]'>
      <h1 className='text-[24px] font-semibold'>코스 수정 페이지</h1>
      <fieldset className='w-[365px] md:w-[700px] flex flex-col mt-[20px]'>
        <TextInput
          infoText={'코스 제목'}
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

        <div className='mt-[50px] w-full flex justify-between pb-[20px]'>
          <CancelButton onClick={handleCancel} />
          <RegisterButton onClick={handleUpdate} disabled={!canRegister} />
        </div>
      </fieldset>
    </form>
  );
}
