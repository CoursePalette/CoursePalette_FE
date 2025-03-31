'use client';

import CancleButton from '@/components/atoms/CancleButton';
import CategorySelect from '@/components/atoms/CategorySelect';
import PlaceSelect from '@/components/atoms/PlaceSelect';
import RegisterButton from '@/components/atoms/RegisterButton';
import TextInput from '@/components/atoms/TextInput';
import PlacesManage from '@/components/molecules/PlacesManage';
import { useCreateCourseStore } from '@/store/course/useCreateCourseStore';

import { useRouter } from 'next/navigation';

export default function CourseCreatePage() {
  const router = useRouter();

  const title = useCreateCourseStore((state) => state.title);
  const setTitle = useCreateCourseStore((state) => state.setTitle);
  const category = useCreateCourseStore((state) => state.category);
  const setCategory = useCreateCourseStore((state) => state.setCategory);

  const places = useCreateCourseStore((state) => state.places);
  const reorderPlaces = useCreateCourseStore((state) => state.reorderPlaces);
  const clearPlaces = useCreateCourseStore((state) => state.clearPlaces);
  const removePlace = useCreateCourseStore((state) => state.removePlace);

  const canRegister = !!title.trim() && !!category.trim() && places.length >= 2;

  const handleCancle = () => {
    setTitle('');
    setCategory('');
    clearPlaces();
    router.back();
  };

  const handleRegister = () => {
    if (!canRegister) return;

    console.log('등록 실행 : ', title, category, places);
  };

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
