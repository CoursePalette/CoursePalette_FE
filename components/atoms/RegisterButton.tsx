import { Button } from '../ui/button'


export interface RegisterButtonProps {
  onClick: () => void,
  disabled?: boolean
}

export default function RegisterButton({onClick, disabled = false} : RegisterButtonProps) {
  return (
    <Button 
    disabled={disabled}
    className='w-[150px] h-[50px] text-white text-[16px] font-semibold rounded-[10px] flex items-center justify-center bg-[#0064FF] hover:bg-[#0064FF]/80' 
    onClick={onClick}>
      등록
    </Button>
  )
}