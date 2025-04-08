import * as courseApi from '@/api/course';
import MyCoursePage from '@/app/course/mycourse/page';
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
jest.mock('@/api/course');
jest.mock('@/lib/checkLogin');

// CourseBox 컴포넌트 모킹하여 페이지 로직에 집중
jest.mock('@/components/molecules/CourseBox', () => {
  // CourseBox는 course prop을 받아서 title 등을 표시
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
const mockGetMyCourses = courseApi.getMyCourses as jest.Mock;
const mockCheckLogin = checkLoginUtil.checkLogin as jest.Mock;
const mockUseQuery = useQuery as jest.Mock;

// 각 테스트 전 스토어 초기화
const initialEditStoreState = useCourseEditStore.getState();
beforeEach(() => {
  useCourseEditStore.setState(initialEditStoreState, true); // 스토어 리셋
});

describe('MyCoursePage', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  let mockRouterPush: jest.Mock;
  let mockRouterBack: jest.Mock; // 뒤로가기 함수 모킹

  // 기본 성공 응답 데이터
  const mockCoursesData: CourseSimpleDto[] = [
    {
      courseId: 1,
      title: '내가 만든 코스 1',
      category: '데이트',
      favorite: 3,
      createdAt: '2024-01-01',
      user: {
        userId: 1,
        nickname: '테스트유저',
        profileImageUrl: 'https://example.com/user1.jpg',
      },
    },
    {
      courseId: 2,
      title: '나만의 비밀 코스',
      category: '혼자서',
      favorite: 8,
      createdAt: '2024-01-02',
      user: {
        userId: 1,
        nickname: '테스트유저',
        profileImageUrl: 'https://example.com/user1.jpg',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // 기본 인증된 세션
    mockUseSession.mockReturnValue({
      data: { user: { backendJwt: 'sample-token', userId: 1 } },
      status: 'authenticated',
      update: jest.fn(),
    });

    // 라우터 모킹
    mockRouterPush = jest.fn();
    mockRouterBack = jest.fn(); // 뒤로가기 모킹
    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack,
      replace: jest.fn(),
    });
    mockUsePathname.mockReturnValue('/course/mycourse');

    // 기본 useQuery 모킹: 성공 상태
    mockUseQuery.mockReturnValue({
      data: mockCoursesData,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  // 컴포넌트 렌더링 헬퍼
  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MyCoursePage />
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
      ); // 라우터 객체 확인
    });
  });

  it('데이터 로딩 중일 때 로딩 컴포넌트를 표시해야 한다', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    renderComponent();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByText('내가 등록한 코스')).not.toBeInTheDocument(); // 제목 등은 로딩 중 없어야 함
  });

  it('데이터 로딩 실패 시 에러 메시지를 표시해야 한다', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Fetch failed'),
    });
    renderComponent();
    expect(screen.getByText('에러 발생')).toBeInTheDocument(); // 컴포넌트의 에러 메시지 확인
  });

  it('데이터 로딩 성공 시 제목, 편집 버튼, 코스 목록이 표시되어야 한다', () => {
    renderComponent();

    expect(screen.getByText('내가 등록한 코스')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /편집 활성화 버튼/i })
    ).toBeInTheDocument();

    // 모킹된 CourseBox 컴포넌트 확인
    expect(screen.getByTestId('course-box-1')).toBeInTheDocument();
    expect(screen.getByTestId('course-box-2')).toBeInTheDocument();
    expect(screen.getByText('내가 만든 코스 1')).toBeInTheDocument();
    expect(screen.getByText('나만의 비밀 코스')).toBeInTheDocument();
  });

  it('불러온 코스 데이터가 없을 경우 코스 목록 영역이 비어있어야 한다', () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    }); // 빈 배열 반환
    renderComponent();

    expect(screen.getByText('내가 등록한 코스')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /편집 활성화 버튼/i })
    ).toBeInTheDocument();

    // CourseBox가 없는지 확인
    expect(screen.queryByTestId(/course-box-/)).not.toBeInTheDocument(); // data-testid 패턴으로 확인
    expect(screen.queryByText(/내가 만든 코스/)).not.toBeInTheDocument(); // 코스 제목 텍스트 부재 확인
  });

  it('편집 토글 버튼 클릭 시 스토어 상태가 변경되고 버튼 텍스트가 변경되어야 한다', async () => {
    renderComponent();
    const user = userEvent.setup();

    const toggleButton = screen.getByRole('button', {
      name: /편집 활성화 버튼/i,
    });

    // 초기 상태 확인
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
    // 초기 렌더 및 편집 모드 활성화
    const { unmount } = renderComponent();
    const user = userEvent.setup();

    const toggleButton = screen.getByRole('button', {
      name: /편집 활성화 버튼/i,
    });

    await user.click(toggleButton);
    expect(useCourseEditStore.getState().isEdit).toBe(true); // 활성화 확인

    // 컴포넌트 언마운트
    unmount();

    // 스토어 상태 확인
    expect(useCourseEditStore.getState().isEdit).toBe(false); // 초기화 확인
  });
});
