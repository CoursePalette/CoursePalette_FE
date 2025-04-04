import { Button } from '../ui/button';

export interface RegisterButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export default function RegisterButton({
  onClick,
  disabled = false,
}: RegisterButtonProps) {
  return (
    <Button
      type='submit'
      disabled={disabled}
      className='w-[150px] h-[50px] text-white text-[16px] font-semibold rounded-[10px] flex items-center justify-center bg-[#0064FF]/80 hover:bg-[#0064FF]'
      onClick={onClick}
      tabIndex={0}
    >
      등록
    </Button>
  );
}
