import * as courseApi from '@/apis/course';
import MyFavoritePage from '@/app/course/myfavorite/page';
import { useCourseEditStore } from '@/store/course/useCourseEditStore';
import { CourseSimpleDto } from '@/types/Course';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as nextAuthReact from 'next-auth/react';

import * as navigation from 'next/navigation';

import React from 'react';

import * as checkLoginUtil from '@/lib/checkLogin';

// 모킹 설정
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));
jest.mock('@/apis/course');
jest.mock('@/lib/checkLogin');

// CourseBox 컴포넌트 모킹
jest.mock('@/components/molecules/CourseBox', () => {
  return function MockCourseBox({ course }: { course: CourseSimpleDto }) {
    return (
      <div data-testid={`course-box-${course.courseId}`}>
        <h2>{course.title}</h2>
        <p>by {course.user.nickname}</p>
      </div>
    );
  };
});

// react-query 모킹
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

// 모킹 구현
const mockUseSession = nextAuthReact.useSession as jest.Mock;
const mockUseRouter = navigation.useRouter as jest.Mock;
const mockUsePathname = navigation.usePathname as jest.Mock;
const mockGetMyFavoriteCourses = courseApi.getMyFavoriteCourses as jest.Mock; // API 함수 이름 변경
const mockCheckLogin = checkLoginUtil.checkLogin as jest.Mock;
const mockUseQuery = useQuery as jest.Mock;

// 각 테스트 전 스토어 초기화
const initialEditStoreState = useCourseEditStore.getState();
beforeEach(() => {
  useCourseEditStore.setState(initialEditStoreState, true);
});

describe('MyFavoritePage', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  let mockRouterPush: jest.Mock;
  let mockRouterBack: jest.Mock;

  // 기본 성공 응답 데이터
  const mockFavoriteCoursesData: CourseSimpleDto[] = [
    {
      courseId: 3,
      title: '즐겨찾기 코스 A',
      category: '감성있는',
      favorite: 15,
      createdAt: '2024-02-01',
      user: { userId: 2, nickname: '다른유저', profileImageUrl: 'url2' },
    },
    {
      courseId: 4,
      title: '인기 데이트 코스',
      category: '데이트',
      favorite: 25,
      createdAt: '2024-02-05',
      user: { userId: 3, nickname: '또다른유저', profileImageUrl: 'url3' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // 기본 인증된 세션
    mockUseSession.mockReturnValue({
      data: { user: { backendJwt: 'sample-token', userId: 1 } }, // 현재 사용자 ID 1
      status: 'authenticated',
      update: jest.fn(),
    });

    // 라우터 모킹
    mockRouterPush = jest.fn();
    mockRouterBack = jest.fn();
    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack,
      replace: jest.fn(),
    });
    mockUsePathname.mockReturnValue('/course/myfavorite'); // 현재 경로 변경

    // 기본 useQuery 모킹: 성공 상태
    mockUseQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'myFavorite') {
        return {
          data: mockFavoriteCoursesData,
          isLoading: false,
          isError: false,
          error: null,
        };
      }
      // 다른 쿼리 키에 대한 기본 반환값
      return { data: undefined, isLoading: true, isError: false, error: null };
    });
    // API 함수 자체는 직접 호출되지 않으므로 모킹 구현은 필요 X (useQuery만 제어)
    // mockGetMyFavoriteCourses.mockResolvedValue(mockFavoriteCoursesData); // 필요 없음
  });

  // 컴포넌트 렌더링 헬퍼
  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MyFavoritePage />
      </QueryClientProvider>
    );
  };

  it('로그인되지 않은 상태에서 접근 시 checkLogin이 호출되어야 한다', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });
    renderComponent();
    await waitFor(() => {
      expect(mockCheckLogin).toHaveBeenCalledTimes(1);
      expect(mockCheckLogin).toHaveBeenCalledWith(
        expect.objectContaining({ back: mockRouterBack })
      );
    });
  });

  it('데이터 로딩 중일 때 로딩 컴포넌트를 표시해야 한다', () => {
    mockUseQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'myFavorite')
        return { data: undefined, isLoading: true, isError: false };
      return { data: undefined, isLoading: true, isError: false };
    });
    renderComponent();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByText('내가 즐겨찾기한 코스')).not.toBeInTheDocument();
  });

  it('데이터 로딩 실패 시 에러 메시지를 표시해야 한다', () => {
    mockUseQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'myFavorite')
        return {
          data: undefined,
          isLoading: false,
          isError: true,
          error: new Error('Fetch failed'),
        };
      return {
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Fetch failed'),
      };
    });
    renderComponent();
    expect(screen.getByText('에러 발생')).toBeInTheDocument();
  });

  it('데이터 로딩 성공 시 제목, 편집 버튼, 즐겨찾기 코스 목록이 표시되어야 한다', () => {
    // beforeEach에서 이미 성공 상태로 설정됨
    renderComponent();

    expect(screen.getByText('내가 즐겨찾기한 코스')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /편집 활성화 버튼/i })
    ).toBeInTheDocument();

    // 모킹된 CourseBox 컴포넌트 확인
    expect(screen.getByTestId('course-box-3')).toBeInTheDocument();
    expect(screen.getByTestId('course-box-4')).toBeInTheDocument();
    expect(screen.getByText('즐겨찾기 코스 A')).toBeInTheDocument();
    expect(screen.getByText('인기 데이트 코스')).toBeInTheDocument();
  });

  it('즐겨찾기한 코스가 없을 경우 코스 목록 영역이 비어있어야 한다', () => {
    mockUseQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'myFavorite')
        return { data: [], isLoading: false, isError: false }; // 빈 배열 반환
      return { data: undefined, isLoading: true, isError: false };
    });
    renderComponent();

    expect(screen.getByText('내가 즐겨찾기한 코스')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /편집 활성화 버튼/i })
    ).toBeInTheDocument();

    expect(screen.queryByTestId(/course-box-/)).not.toBeInTheDocument();
    expect(screen.queryByText(/즐겨찾기 코스/)).not.toBeInTheDocument();
  });

  it('편집 토글 버튼 클릭 시 스토어 상태가 변경되고 버튼 텍스트가 변경되어야 한다', async () => {
    renderComponent();
    const user = userEvent.setup();
    const toggleButton = screen.getByRole('button', {
      name: /편집 활성화 버튼/i,
    });

    expect(useCourseEditStore.getState().isEdit).toBe(false);

    // 편집 모드 활성화
    await user.click(toggleButton);
    expect(useCourseEditStore.getState().isEdit).toBe(true);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /편집 취소 버튼/i })
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('button', { name: /편집 활성화 버튼/i })
    ).not.toBeInTheDocument();

    // 편집 모드 비활성화
    const cancelButton = screen.getByRole('button', {
      name: /편집 취소 버튼/i,
    });
    await user.click(cancelButton);
    expect(useCourseEditStore.getState().isEdit).toBe(false);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /편집 활성화 버튼/i })
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('button', { name: /편집 취소 버튼/i })
    ).not.toBeInTheDocument();
  });

  it('컴포넌트 언마운트 시 편집 상태가 false로 초기화되어야 한다', async () => {
    const { unmount } = renderComponent();
    const user = userEvent.setup();
    const toggleButton = screen.getByRole('button', {
      name: /편집 활성화 버튼/i,
    });
    await user.click(toggleButton);
    expect(useCourseEditStore.getState().isEdit).toBe(true);

    unmount();

    expect(useCourseEditStore.getState().isEdit).toBe(false);
  });
});
