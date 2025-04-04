import { kakaoLogin } from '@/api/kakao';
import Swal from 'sweetalert2';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const checkLogin = (router: AppRouterInstance) => {
  Swal.fire({
    title: '로그인 필요',
    text: '로그인이 필요합니다.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '로그인하기',
    cancelButtonText: '뒤로가기',
  }).then((result) => {
    if (result.isConfirmed) {
      kakaoLogin();
    } else if (
      result.dismiss === Swal.DismissReason.cancel ||
      result.dismiss === Swal.DismissReason.backdrop
    ) {
      router.back();
    }
  });
};
