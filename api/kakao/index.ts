import { signIn, signOut } from 'next-auth/react';

import { axiosInstance } from '../axiosInstance';

export interface sendKakaoProfileResponse {
  token: string; // 백엔드 JWT
  nickname: string;
  userId: number;
  profileImageUrl: string;
}

export const sendKakaoProfile = async (
  kakaoId: number,
  nickname: string,
  profileImageUrl: string
): Promise<sendKakaoProfileResponse> => {
  const response = await axiosInstance.post('/auth/kakao', {
    kakaoId,
    nickname,
    profileImageUrl,
  });

  return response.data;
};

export const kakaoLogin = async () => {
  await signIn('kakao');
};

export const kakaoLogout = async () => {
  await signOut({
    callbackUrl: '/',
  });
};
