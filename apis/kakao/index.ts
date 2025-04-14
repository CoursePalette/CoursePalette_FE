import { KakaoAuthResponseDto } from '@/types/User';
import { signIn, signOut } from 'next-auth/react';

import { axiosServer } from '../axiosInstance';

// export interface sendKakaoProfileResponse {
//   token: string; // 백엔드 JWT
//   nickname: string;
//   userId: number;
//   profileImageUrl: string;
// }

export const sendKakaoProfile = async (
  kakaoId: number,
  nickname: string,
  profileImageUrl: string
): Promise<KakaoAuthResponseDto> => {
  const response = await axiosServer.post<KakaoAuthResponseDto>('/auth/kakao', {
    kakaoId,
    nickname,
    profileImageUrl,
  });

  return response.data;
};

export const kakaoLogin = async () => {
  await signIn('kakao', {
    callbackUrl: '/',
  });
};

export const kakaoLogout = async () => {
  await signOut({
    callbackUrl: '/',
  });
};
