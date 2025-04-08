'use client';

export interface MenuBoxProps {
  text: string;
  onClick: () => void;
}

export default function MenuBox({ text, onClick }: MenuBoxProps) {
  return (
    <button
      onClick={onClick}
      type='button'
      className='w-full h-[100px] py-[30px] px-[20px] cursor-pointer bg-white text-black text-[32px] font-semibold
        border-b border-black
      hover:bg-black hover:text-white'
    >
      {text}
    </button>
  );
}
