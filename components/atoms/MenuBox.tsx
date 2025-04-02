'use client';

import { useRouter } from 'next/navigation';

export interface MenuBoxProps {
  text: string;
  url: string;
}

export default function MenuBox({ text, url }: MenuBoxProps) {
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      router.push(url);
    }
  };

  return (
    <div
      onClick={() => router.push(url)}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
      className='w-full h-[100px] py-[30px] px-[20px] cursor-pointer bg-white text-black text-[32px] font-semibold
        border-b border-black
      hover:bg-black hover:text-white'
    >
      <span>{text}</span>
    </div>
  );
}
