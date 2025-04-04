'use client';

import { Button } from '../ui/button';

export default function FavoriteButton() {
  return (
    <Button
      aria-label='코스 즐겨찾기 버튼'
      tabIndex={0}
      className='w-[125px] md:w-[150px] h-[40px] bg-[#D3E4FF]/80 hover:bg-[#0064FF]/80  text-[#0064FF] hover:text-white absolute -top-[50px] right-0 rounded-[30px] '
    >
      코스 즐겨찾기
    </Button>
  );
}
