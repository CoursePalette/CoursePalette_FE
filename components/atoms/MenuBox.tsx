'use client';

export interface MenuBoxProps {
  text: string;
  onClick: () => void;
}

export default function MenuBox({ text, onClick }: MenuBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
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
