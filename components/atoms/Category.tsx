'use client';

import { Button } from '../ui/button';

export interface CategoryProps {
  category: string;
  selected: boolean;
  setCategory: (tag: string) => void;
}

export default function Category({
  category,
  selected,
  setCategory,
}: CategoryProps) {
  return (
    <Button
      tabIndex={0}
      aria-pressed={selected}
      className={`px-[20px] py-[7px] rounded-[16px] hover:bg-[#0064FF]/90 hover:text-white  ${selected ? 'bg-[#0064FF] text-white' : 'bg-[#D3E4FF] text-[#0064FF]'}`}
      onClick={() => setCategory(category)}
    >
      <span className='text-[14px] font-semibold'>{category}</span>
    </Button>
  );
}
