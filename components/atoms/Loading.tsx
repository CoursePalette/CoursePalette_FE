'use client';

// 로딩 컴포넌트가 실제로 렌더될때만 스피너가 로드되어 초기 JS 번들 사이즈 감소
import dynamic from 'next/dynamic';

const PulseLoader = dynamic(() => import('react-spinners/PulseLoader'), {
  ssr: false,
});

export default function Loading() {
  return (
    <div className='w-full h-full flex items-center justify-center '>
      <PulseLoader
        color='#0064FF'
        loading={true}
        size={12}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  );
}
