/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from '@/api/axiosInstance';
import { getSession } from 'next-auth/react';

// next-auth/react 모듈 전체를 mock 처리 -> 실제 api 호출 없이 가짜 세션 데이터로 테스트
jest.mock('next-auth/react');

describe('axiosInstance', () => {
  // 테스트 실행 전 모든 mock 상태 초기화
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('세션에 backendJwt가 있으면 Authorization 헤더를 세팅한다.', async () => {
    (getSession as jest.Mock).mockResolvedValue({
      user: { backendJwt: 'test-jwt' },
    });

    const config: any = { headers: {} };

    const fulfilledInterceptor = (axiosClient.interceptors.request as any)
      .handlers[0].fulfilled;
    const result = await fulfilledInterceptor(config);
    expect(result.headers.Authorization).toBe('Bearer test-jwt');
  });

  it('세션이 없다면 Authorization 헤더가 설정되지 않아야 함', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    const config: any = { headers: {} };

    const fulfilledInterceptor = (axiosClient.interceptors.request as any)
      .handlers[0].fulfilled;
    const result = await fulfilledInterceptor(config);
    expect(result.headers.Authorization).toBeUndefined();
  });
});
