'use client';

import { useCategoryStore } from '@/store/course/useCategoryStore';

import Category from '../atoms/Category';

const categoryList = [
  '전체',
  '혼자서',
  '가족들과',
  '데이트',
  '친구들과',
  '단체로',
  '여유로운',
  '감성있는',
  '신나는',
  '활동적인',
];

export default function Categories() {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const setCategory = useCategoryStore((state) => state.setCategory);

  return (
    <div
      role='group'
      className='flex gap-[20px] w-[350px] md:w-[700px] overflow-x-auto overflow-y-hidden custom-scroll
      fixed top-[95px] left-1/2 transform -translate-x-1/2 z-50
    '
      tabIndex={0}
    >
      {categoryList.map((category) => (
        <Category
          key={category}
          category={category}
          selected={category === selectedCategory}
          setCategory={setCategory}
        />
      ))}
    </div>
  );
}
