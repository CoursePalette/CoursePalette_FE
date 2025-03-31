import { Button } from '../ui/button'




export interface CancleButtonProps {
  onClick: () => void
}

export default function CancleButton({onClick} : CancleButtonProps) {
  return (
    <Button 
    className='w-[150px] h-[50px] text-black text-[16px] font-semibold rounded-[10px] hover:text-white border border-black flex items-center justify-center bg-white' 
    onClick={onClick}>
      취소
    </Button>
  )
}