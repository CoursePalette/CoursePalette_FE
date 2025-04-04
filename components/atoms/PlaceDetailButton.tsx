'use client';

import { Button } from '../ui/button';

interface PlaceDetailButtonProps {
  placeUrl: string;
}

export default function PlaceDetailButton({
  placeUrl,
}: PlaceDetailButtonProps) {
  return (
    <Button
      className='!w-[200px] !h-[40px] text-center leading-[40px] bg-[#D3E4FF] text-[#0064FF] text-[16px] rounded-[16px]
      hover:bg-[#0064FF] hover:text-white
    '
      onClick={() => window.open(placeUrl, '_blank', 'noopener,noreferrer')}
      tabIndex={0}
      aria-label='장소 상세 정보 보기'
    >
      장소 상세 정보 보기
    </Button>
  );
}
