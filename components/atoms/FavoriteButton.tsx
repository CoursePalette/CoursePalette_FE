'use client';

import { registCourseFavorite } from '@/apis/course';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

import { useRouter } from 'next/navigation';

import { checkLogin } from '@/lib/checkLogin';

import { Button } from '../ui/button';

interface FavoriteButtonProps {
  courseId: number;
}

export default function FavoriteButton({ courseId }: FavoriteButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleFavorite = async () => {
    if (status === 'loading') return;
    if (!session?.user?.backendJwt) {
      checkLogin(router);
      return;
    }

    const response = await registCourseFavorite({ courseId });
    if (response.message === '코스를 즐겨찾기 했습니다!') {
      Swal.fire({
        title: '즐겨찾기 완료',
        text: `코스를 즐겨찾기 했습니다!`,
        icon: 'success',
      });
    } else if (response.message === '이미 즐겨찾기 된 코스입니다.') {
      Swal.fire({
        title: '즐겨찾기 중복 요청',
        text: `이미 즐겨찾기 된 코스입니다.`,
        icon: 'warning',
      });
    } else {
      Swal.fire({
        title: '즐겨찾기 실패',
        text: `오류가 발생했습니다.`,
        icon: 'error',
      });
    }
  };

  return (
    <Button
      onClick={handleFavorite}
      aria-label='코스 즐겨찾기 버튼'
      tabIndex={0}
      className='w-[125px] md:w-[150px] h-[40px] bg-[#D3E4FF]/80 hover:bg-[#0064FF]/80  text-[#0064FF] hover:text-white absolute -top-[50px] right-0 rounded-[30px] '
    >
      코스 즐겨찾기
    </Button>
  );
}
