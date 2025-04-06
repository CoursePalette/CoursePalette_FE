import { Button } from '../ui/button';

export interface EditButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <Button
      aria-label='수정 버튼'
      type='button'
      onClick={onClick}
      tabIndex={0}
      className='w-[40px] h-[30px] bg-[#5E9DFF] text-white text-[14px] font-normal cursor-pointer hover:bg-[#5E9DFF]/90'
    >
      수정
    </Button>
  );
}
