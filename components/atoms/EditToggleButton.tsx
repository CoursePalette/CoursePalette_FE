'use client';

import { useCourseEditStore } from '@/store/course/useCourseEditStore';

import { Button } from '../ui/button';

export default function EditToggleButton() {
  const isEdit = useCourseEditStore((state) => state.isEdit);
  const setIsEdit = useCourseEditStore((state) => state.setIsEdit);
  return (
    <Button
      tabIndex={0}
      aria-label={isEdit ? '편집 취소 버튼' : '편집 활성화 버튼'}
      onClick={() => setIsEdit(!isEdit)}
      className='w-[100px] h-[50px] rounded-[10px] text-[18px] font-semibold leading-[50px] text-center bg-white border border-black text-black hover:text-white'
    >
      {isEdit ? '취소' : '편집'}
    </Button>
  );
}
