import { kakaoLogin, kakaoLogout, sendKakaoProfile } from '@/apis/kakao';
import axios from 'axios';
import { signIn, signOut } from 'next-auth/react';

jest.mock('axios');
jest.mock('next-auth/react');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('kakao Api', () => {
  it('sendKakaoProfile 응답 데이터 반환', async () => {
    const responseData = {
      token: 'jwt-sample-token',
      userId: 123,
      nickname: 'kakaoUser',
      profileImageUrl: 'https://example.com/kakao.jpg',
    };

    mockedAxios.post.mockResolvedValueOnce({ data: responseData });
    const result = await sendKakaoProfile(
      123,
      'kakaoUser',
      'https://example.com/kakao.jpg'
    );
    expect(result).toEqual(responseData);
    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/kakao', {
      kakaoId: 123,
      nickname: 'kakaoUser',
      profileImageUrl: 'https://example.com/kakao.jpg',
    });
  });

  it('kakaoLogin signIn 호출', async () => {
    await kakaoLogin();
    expect(signIn).toHaveBeenCalledWith('kakao');
  });

  it('kakaoLogout은 signOut을 callbackUrl과 함께 호출', async () => {
    await kakaoLogout();
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
  });
});
