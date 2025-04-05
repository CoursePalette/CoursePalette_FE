import { Button } from '../ui/button';

export interface DeleteButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <Button
      type='button'
      onClick={onClick}
      tabIndex={0}
      className='w-[40px] h-[30px] bg-[#ff7272] text-white text-[14px] font-normal cursor-pointer hover:bg-[#ff7272]/90'
    >
      삭제
    </Button>
  );
}
