// import * as homeApi from '@/apis/home';
// import Home from '@/app/page';
// Server Component 가져오기
import HomeClient from '@/components/organisms/HomeClient';
import { useCategoryStore } from '@/store/course/useCategoryStore';
// API 모듈 모킹
import { useSearchCourseStore } from '@/store/course/useSearchCourseStore';
import { useSidebarStore } from '@/store/sidebar/useSidebarStore';
import { HomeResponseDto } from '@/types/Home';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as nextAuthReact from 'next-auth/react';

import * as navigation from 'next/navigation';

import React from 'react';

// next-auth/react 모킹
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useSession: jest.fn(),
}));

// next/navigation 모킹
// Server Component('app/page.tsx')를 직접 테스트할 때는 Server Context가 필요할 수 있어 복잡.
// Client Component('HomeClient.tsx')를 직접 테스트하는 것이 더 간단할 수 있음.
// 여기서는 HomeClient를 직접 테스트하는 방향으로 진행
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()), // 기본 빈 SearchParams 반환
}));

// API 호출 모킹
jest.mock('@/apis/home');

// Map 컴포넌트 모킹 (Kakao Maps SDK 회피)
jest.mock('@/components/molecules/Map', () => {
  return function MockMap() {
    return <div data-testid='mock-map'>Mock Map</div>;
  };
});

// react-query 모킹
// 실제 API 모킹으로도 가능하지만, useQuery 직접 모킹이 더 명확
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'), // 다른 export 유지
  useQuery: jest.fn(), // useQuery 모킹
}));

// --- 모킹 구현 ---
const mockUseSession = nextAuthReact.useSession as jest.Mock;
const mockUseRouter = navigation.useRouter as jest.Mock;
const mockUsePathname = navigation.usePathname as jest.Mock;
// const mockGetHomeData = homeApi.getHomeData as jest.Mock;
const mockUseQuery = useQuery as jest.Mock; // useQuery 모킹 변수

// 각 테스트 전 스토어 초기화
const initialSearchState = useSearchCourseStore.getState();
const initialCategoryState = useCategoryStore.getState();
const initialSidebarState = useSidebarStore.getState();
beforeEach(() => {
  useSearchCourseStore.setState(initialSearchState, true);
  useCategoryStore.setState(initialCategoryState, true);
  useSidebarStore.setState(initialSidebarState, true);
});

describe('HomePage (HomeClient)', () => {
  // QueryClient는 실제 인스턴스 사용
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  let mockRouterPush: jest.Mock;

  // 기본 성공 응답 데이터
  const mockSuccessData: HomeResponseDto = {
    courses: [
      {
        courseId: 1,
        title: '테스트 코스 1',
        category: '데이트',
        favorite: 5,
        createdAt: '2024-01-01',
        user: {
          userId: 1,
          nickname: '유저1',
          profileImageUrl: 'https://example.com/user1.jpg',
        },
      },
      {
        courseId: 2,
        title: '테스트 코스 2',
        category: '혼자서',
        favorite: 10,
        createdAt: '2024-01-02',
        user: {
          userId: 2,
          nickname: '유저2',
          profileImageUrl: 'https://example.com/user2.png',
        },
      },
    ],
    places: [
      {
        placeId: 'p1',
        name: '장소1',
        address: '주소1',
        latitude: '1',
        longitude: '1',
        placeUrl: 'https://place.example.com/p1',
      },
      {
        placeId: 'p2',
        name: '장소2',
        address: '주소2',
        latitude: '2',
        longitude: '2',
        placeUrl: 'https://place.example.com/p2',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // 기본 인증된 세션
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: '테스트유저',
          nickname: '테스트닉네임',
          profileImageUrl: 'img_url',
        },
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    // 라우터 모킹
    mockRouterPush = jest.fn();
    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
      back: jest.fn(),
      replace: jest.fn(),
    });
    mockUsePathname.mockReturnValue('/'); // 현재 경로 '/'

    // 기본 useQuery 모킹: 성공 상태
    mockUseQuery.mockReturnValue({
      data: mockSuccessData,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  // 컴포넌트 렌더링 헬퍼 (HomeClient 직접 렌더링)
  const renderHomeClient = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <HomeClient dehydratedState={{}} />{' '}
      </QueryClientProvider>
    );
  };

  it('데이터 로딩 성공 시 주요 UI 요소들이 렌더링되어야 한다', () => {
    renderHomeClient();

    // ModalHeader 요소 확인 (검색 입력창, 검색 버튼, 메뉴 버튼)
    expect(
      screen.getByPlaceholderText(/코스를 검색해 보세요!/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /검색하기/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /메뉴 열기/i })
    ).toBeInTheDocument(); // ModalHeader 내 메뉴 버튼

    // Categories 요소 확인
    expect(screen.getByRole('button', { name: '전체' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '데이트' })).toBeInTheDocument();

    // 모킹된 Map 확인
    expect(screen.getByTestId('mock-map')).toBeInTheDocument();

    // Sidebar 관련 버튼 확인
    expect(
      screen.getByRole('button', { name: /사이드바 열기/i })
    ).toBeInTheDocument(); // SidebarOpenButton

    // CourseCreateButton 확인
    expect(
      screen.getByRole('button', { name: /코스 생성 버튼/i })
    ).toBeInTheDocument();

    // SideBar 내 코스 목록 확인 (SideBar가 열려있지 않아도 CourseBox가 렌더링될 수 있음)
    // CourseBox가 렌더링하는 내용을 기반으로 확인
    expect(screen.getByText('테스트 코스 1')).toBeInTheDocument();
    expect(screen.getByText('테스트 코스 2')).toBeInTheDocument();
  });

  it('데이터 로딩 중일 때 로딩 컴포넌트를 표시해야 한다', async () => {
    // useQuery를 로딩 상태로 모킹
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderHomeClient();

    // 로딩 컴포넌트 확인
    // expect(screen.getByTestId('loader')).toBeInTheDocument();
    const loaderElement = await screen.findByTestId('loader');
    expect(loaderElement).toBeInTheDocument();

    // 다른 주요 요소들은 없어야 함 (Map, Categories 등)
    expect(screen.queryByTestId('mock-map')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '전체' })
    ).not.toBeInTheDocument();
    // 검색창 등 헤더 일부는 보일 수 있으므로, 핵심 콘텐츠 위주로 확인
  });

  it('데이터 로딩 실패 시 에러 메시지를 표시해야 한다', () => {
    // useQuery를 에러 상태로 모킹
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch'), // 에러 객체 전달
    });

    renderHomeClient();

    // 에러 메시지 확인 (HomeClientInner의 에러 처리 텍스트와 일치해야 함)
    expect(screen.getByText('에러가 발생했습니다.')).toBeInTheDocument();

    // 다른 주요 요소들은 없어야 함
    expect(screen.queryByTestId('mock-map')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '전체' })
    ).not.toBeInTheDocument();
  });

  it('검색어 입력 및 검색 실행 시 검색 스토어 상태가 업데이트되어야 한다', async () => {
    renderHomeClient();
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/코스를 검색해 보세요!/i);
    const searchButton = screen.getByRole('button', { name: /검색하기/i });

    await user.type(searchInput, '성수동 맛집');
    expect(searchInput).toHaveValue('성수동 맛집');

    await user.click(searchButton);

    // 스토어 상태 확인
    expect(useSearchCourseStore.getState().search).toBe('성수동 맛집');

    // useQuery가 새 검색어로 호출(또는 invalidate)되었는지 확인
    // useQuery 모킹을 사용했으므로, 마지막 호출 인자 등을 확인 가능
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['homeData', '성수동 맛집', '전체'], // 카테고리는 기본값 '전체' 가정
      })
    );
  });

  it('카테고리 버튼 클릭 시 카테고리 스토어 상태가 업데이트되어야 한다', async () => {
    renderHomeClient();
    const user = userEvent.setup();

    const categoryButton = screen.getByRole('button', { name: '데이트' });
    await user.click(categoryButton);

    // 스토어 상태 확인
    expect(useCategoryStore.getState().selectedCategory).toBe('데이트');

    // useQuery가 새 카테고리로 호출(또는 invalidate)되었는지 확인
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['homeData', '', '데이트'], // 검색어는 기본값 '' 가정
      })
    );
  });

  it('사이드바 열기/닫기 버튼 클릭 시 사이드바 스토어 상태가 변경되어야 한다', async () => {
    renderHomeClient();
    const user = userEvent.setup();

    const openButton = screen.getByRole('button', { name: /사이드바 열기/i }); // 초기 상태는 '열기'

    // 열기
    expect(useSidebarStore.getState().isOpen).toBe(false); // 초기 상태 false
    await user.click(openButton);
    expect(useSidebarStore.getState().isOpen).toBe(true); // 열린 상태 true

    // 닫기 버튼 찾기 (aria-label이 변경됨)
    // SideBar 컴포넌트 내부의 닫기 버튼을 찾아야 할 수도 있음
    // 여기서는 SidebarOpenButton의 aria-label 변경을 확인하거나, SideBar 내부 닫기 버튼 확인
    // aria-expanded 속성을 사용하여 SidebarOpenButton을 명확히 타겟팅
    const closeButton = await screen.findByRole('button', {
      name: /사이드바 닫기/i,
      expanded: true, // SidebarOpenButton은 열린 상태에서 expanded가 true가 됨
    });
    await user.click(closeButton); // 닫기 버튼 클릭
    expect(useSidebarStore.getState().isOpen).toBe(false); // 닫힌 상태 false
  });

  it('코스 생성 버튼 클릭 시 /course/create 페이지로 이동해야 한다', async () => {
    renderHomeClient();
    const user = userEvent.setup();

    const createButton = screen.getByRole('button', {
      name: /코스 생성 버튼/i,
    });
    await user.click(createButton);

    // 라우터 push 호출 확인
    expect(mockRouterPush).toHaveBeenCalledTimes(1);
    expect(mockRouterPush).toHaveBeenCalledWith('/course/create');
  });
});
