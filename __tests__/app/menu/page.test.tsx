import * as kakaoApi from '@/apis/kakao';
import Providers from '@/app/Providers';
import MenuPage from '@/app/menu/page';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as nextAuthReact from 'next-auth/react';

import { usePathname, useRouter } from 'next/navigation';

import React from 'react';

// next-auth/react 모킹
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    ...originalModule,
    SessionProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    useSession: jest.fn(),
  };
});

// next/navigation 모킹
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// @/api/kakao 모킹
jest.mock('@/apis/kakao', () => ({
  kakaoLogin: jest.fn(),
  kakaoLogout: jest.fn(),
}));

// useSession, useRouter, usePathname 훅의 타입을 명시적으로 지정
const mockUseSession = nextAuthReact.useSession as jest.MockedFunction<
  typeof nextAuthReact.useSession
>;
const mockUseRouter = useRouter as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;
const mockKakaoLogin = kakaoApi.kakaoLogin as jest.Mock;
const mockKakaoLogout = kakaoApi.kakaoLogout as jest.Mock;

describe('MenuPage', () => {
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouterPush = jest.fn();
    // useRouter 모의 반환값 설정
    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
      back: jest.fn(),
      replace: jest.fn(),
    });
    // usePathname 모의 반환값 설정
    mockUsePathname.mockReturnValue('/menu');
  });

  it('로그인 상태일 때 메뉴 항목들이 올바르게 표시되어야 한다', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: '테스트유저',
          email: 'test@example.com',
          image: 'https://example.com/avatar.jpg',
          backendJwt: 'mock-jwt-token',
          userId: 1,
          nickname: '테스트닉네임',
          profileImageUrl: 'https://example.com/profile.jpg',
        },
        expires: 'mock-expires',
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <Providers>
        <MenuPage />
      </Providers>
    );

    // Header 내부의 UserProfile 렌더링 확인
    expect(screen.getByText('테스트닉네임')).toBeInTheDocument();
    expect(screen.getByAltText('유저 프로필 사진')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /내가 등록한 코스/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /즐겨찾기한 코스/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /로그아웃/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /로그인/i })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: /내가 등록한 코스/i })
    );
    expect(mockRouterPush).toHaveBeenCalledWith('course/mycourse');

    await userEvent.click(
      screen.getByRole('button', { name: /즐겨찾기한 코스/i })
    );
    expect(mockRouterPush).toHaveBeenCalledWith('course/myfavorite');

    await userEvent.click(screen.getByRole('button', { name: /로그아웃/i }));
    expect(mockKakaoLogout).toHaveBeenCalledTimes(1);
  });

  it('로그아웃 상태일 때 로그인 버튼만 표시되어야 한다', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    render(
      <Providers>
        <MenuPage />
      </Providers>
    );

    expect(screen.queryByText('테스트닉네임')).not.toBeInTheDocument();
    expect(screen.queryByAltText('유저 프로필 사진')).not.toBeInTheDocument();

    const loginButton = screen.getByRole('button', { name: /로그인/i });
    expect(loginButton).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /내가 등록한 코스/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /즐겨찾기한 코스/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /로그아웃/i })
    ).not.toBeInTheDocument();

    await userEvent.click(loginButton);
    expect(mockKakaoLogin).toHaveBeenCalledTimes(1);
  });

  it('세션 로딩 중일 때 로딩 컴포넌트가 표시되어야 한다', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
      update: jest.fn(),
    });

    render(
      <Providers>
        <MenuPage />
      </Providers>
    );

    // expect(screen.getByTestId('loader')).toBeInTheDocument();
    const loaderElement = await screen.findByTestId('loader');
    expect(loaderElement).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /로그인/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /내가 등록한 코스/i })
    ).not.toBeInTheDocument();
  });
});
