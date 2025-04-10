import * as courseApi from '@/api/course';
import CourseDetailClient from '@/components/organisms/CourseDetailClient';
import { CoursePlaceDto } from '@/types/Course';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as nextAuthReact from 'next-auth/react';
import Swal from 'sweetalert2';

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
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

// CourseDetailMap 컴포넌트 모킹 (Kakao Maps SDK 회피)
jest.mock('@/components/molecules/CourseDetailMap', () => {
  return function MockCourseDetailMap({
    places,
    currentIndex,
  }: {
    places: CoursePlaceDto[];
    currentIndex: number;
  }) {
    return (
      <div data-testid='mock-course-detail-map'>
        Mock Map - Current Index: {currentIndex}
        {places.length > 0 && <span>First place: {places[0].name}</span>}
      </div>
    );
  };
});

// PlaceSlide 컴포넌트 모킹
jest.mock('@/components/molecules/PlaceSlide', () => {
  return function MockPlaceSlide({
    places,
    setCurrentSlide,
    courseId,
  }: {
    places: CoursePlaceDto[];
    setCurrentSlide: (index: number) => void;
    courseId: number;
  }) {
    // 실제 필요한 버튼 컴포넌트들을 가져옴
    const BackButton = jest.requireActual(
      '@/components/atoms/BackButton'
    ).default;
    const FavoriteButton = jest.requireActual(
      '@/components/atoms/FavoriteButton'
    ).default;
    const PlaceDetailButton = jest.requireActual(
      '@/components/atoms/PlaceDetailButton'
    ).default;

    return (
      <div data-testid='mock-place-slide'>
        {/* 실제 버튼 컴포넌트 렌더링 */}
        <BackButton />
        <FavoriteButton courseId={courseId} />

        {/* 캐러셀 컨텐츠 모의 렌더링 (첫번째 장소 기준) */}
        <p>{places[0]?.name}</p>
        <p>{places[0]?.address}</p>
        {/* 실제 PlaceDetailButton 렌더링 */}
        <PlaceDetailButton placeUrl={places[0]?.placeUrl} />

        {/* 테스트용 상태 변경 버튼 */}
        <button
          aria-label='다음 장소 보기 (Mock)'
          onClick={() => setCurrentSlide(1)}
        >
          Mock Next
        </button>
        <button
          aria-label='이전 장소 보기 (Mock)'
          onClick={() => setCurrentSlide(0)}
        >
          Mock Prev
        </button>
      </div>
    );
  };
});

// window.open 모킹 (PlaceDetailButton 테스트용)
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', { value: mockWindowOpen });

// 모킹 구현
const mockUseSession = nextAuthReact.useSession as jest.Mock;
const mockUseRouter = navigation.useRouter as jest.Mock;
const mockUsePathname = navigation.usePathname as jest.Mock; // 필요시
const mockRegistCourseFavorite = courseApi.registCourseFavorite as jest.Mock;
const mockCheckLogin = checkLoginUtil.checkLogin as jest.Mock;
const mockSwalFire = Swal.fire as jest.Mock;

describe('CourseDetailClient', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  let mockRouterBack: jest.Mock;

  // 기본 테스트 데이터
  const testCourseId = 456;
  const mockPlaces: CoursePlaceDto[] = [
    {
      placeId: 'p10',
      name: '첫번째 장소',
      address: '첫번째 주소',
      latitude: '37.1',
      longitude: '127.1',
      placeUrl: 'https://place.map.kakao.com/p10',
      sequence: 1,
    },
    {
      placeId: 'p11',
      name: '두번째 장소',
      address: '두번째 주소',
      latitude: '37.2',
      longitude: '127.2',
      placeUrl: 'https://place.map.kakao.com/p11',
      sequence: 2,
    },
    {
      placeId: 'p12',
      name: '세번째 장소',
      address: '세번째 주소',
      latitude: '37.3',
      longitude: '127.3',
      placeUrl: 'https://place.map.kakao.com/p12',
      sequence: 3,
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
    mockRouterBack = jest.fn();
    mockUseRouter.mockReturnValue({
      back: mockRouterBack,
      push: jest.fn(),
      replace: jest.fn(),
    });
    mockUsePathname.mockReturnValue(`/course/detail/${testCourseId}`);

    // 기본 Swal, API 모킹
    mockSwalFire.mockResolvedValue({ isConfirmed: true });
    mockRegistCourseFavorite.mockResolvedValue({
      message: '코스를 즐겨찾기 했습니다!',
    });
  });

  // 컴포넌트 렌더링 헬퍼
  const renderComponent = (places = mockPlaces, courseId = testCourseId) => {
    const session = mockUseSession(); // 현재 mockUseSession 값을 가져옴
    return render(
      <QueryClientProvider client={queryClient}>
        <nextAuthReact.SessionProvider session={session.data}>
          <CourseDetailClient places={places} courseId={courseId} />
        </nextAuthReact.SessionProvider>
      </QueryClientProvider>
    );
  };

  it('초기 렌더링 시 지도(모킹됨), 장소 슬라이드(모킹됨), 버튼들이 표시되어야 한다', () => {
    renderComponent();

    expect(screen.getByTestId('mock-course-detail-map')).toBeInTheDocument();
    expect(screen.getByTestId('mock-course-detail-map')).toHaveTextContent(
      'Current Index: 0'
    );

    // Mock PlaceSlide 내부 요소 확인
    expect(screen.getByTestId('mock-place-slide')).toBeInTheDocument();
    expect(screen.getByText(mockPlaces[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockPlaces[0].address)).toBeInTheDocument();

    // Mock PlaceSlide 내부에 렌더링된 실제 버튼 확인
    expect(
      screen.getByRole('button', { name: '장소 상세 정보 보기' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /뒤로가기/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /코스 즐겨찾기/i })
    ).toBeInTheDocument();
  });

  it('로그인 상태에서 즐겨찾기 버튼 클릭 시 API 호출 및 성공 메시지를 표시해야 한다', async () => {
    renderComponent();
    const user = userEvent.setup();
    const favoriteButton = screen.getByRole('button', {
      name: /코스 즐겨찾기/i,
    });
    await user.click(favoriteButton);

    await waitFor(() => {
      expect(mockRegistCourseFavorite).toHaveBeenCalledTimes(1);
      expect(mockRegistCourseFavorite).toHaveBeenCalledWith({
        courseId: testCourseId,
      });
    });

    await waitFor(() => {
      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: '즐겨찾기 완료',
          text: '코스를 즐겨찾기 했습니다!',
        })
      );
    });
  });

  it('로그인 상태에서 이미 즐겨찾기된 코스 버튼 클릭 시 경고 메시지를 표시해야 한다', async () => {
    mockRegistCourseFavorite.mockResolvedValue({
      message: '이미 즐겨찾기 된 코스입니다.',
    });
    renderComponent();
    const user = userEvent.setup();
    const favoriteButton = screen.getByRole('button', {
      name: /코스 즐겨찾기/i,
    });
    await user.click(favoriteButton);

    await waitFor(() => {
      expect(mockRegistCourseFavorite).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'warning',
          title: '즐겨찾기 중복 요청',
          text: '이미 즐겨찾기 된 코스입니다.',
        })
      );
    });
  });

  it('로그아웃 상태에서 즐겨찾기 버튼 클릭 시 checkLogin을 호출해야 한다', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });
    renderComponent();
    const user = userEvent.setup();

    const favoriteButton = screen.getByRole('button', {
      name: /코스 즐겨찾기/i,
    });
    await user.click(favoriteButton);

    await waitFor(() => {
      expect(mockCheckLogin).toHaveBeenCalledTimes(1);
      expect(mockCheckLogin).toHaveBeenCalledWith(expect.any(Object));
    });

    expect(mockRegistCourseFavorite).not.toHaveBeenCalled();
    expect(mockSwalFire).not.toHaveBeenCalled();
  });

  it('뒤로가기 버튼 클릭 시 router.back이 호출되어야 한다', async () => {
    renderComponent();
    const user = userEvent.setup();
    const backButton = screen.getByRole('button', { name: /뒤로가기/i });
    await user.click(backButton);
    expect(mockRouterBack).toHaveBeenCalledTimes(1);
  });

  it('장소 상세 정보 보기 버튼 클릭 시 window.open이 호출되어야 한다', async () => {
    renderComponent();
    const user = userEvent.setup();
    // 실제 PlaceDetailButton이 MockPlaceSlide 내부에 렌더링되므로, 해당 버튼을 찾음
    const detailButton = screen.getByRole('button', {
      name: '장소 상세 정보 보기',
    });
    await user.click(detailButton);

    // window.open 호출 확인
    expect(mockWindowOpen).toHaveBeenCalledTimes(1);
    expect(mockWindowOpen).toHaveBeenCalledWith(
      mockPlaces[0].placeUrl,
      '_blank',
      'noopener,noreferrer'
    );
  });

  // 캐러셀 대신 Mock 버튼 상호작용 테스트
  it('Mock 다음 버튼 클릭 시 currentIndex가 변경되어 지도에 반영되어야 한다', async () => {
    renderComponent();
    const user = userEvent.setup();

    expect(screen.getByTestId('mock-course-detail-map')).toHaveTextContent(
      'Current Index: 0'
    );

    const mockNextButton = screen.getByRole('button', {
      name: '다음 장소 보기 (Mock)',
    });
    await user.click(mockNextButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-course-detail-map')).toHaveTextContent(
        'Current Index: 1'
      );
    });

    const mockPrevButton = screen.getByRole('button', {
      name: '이전 장소 보기 (Mock)',
    });
    await user.click(mockPrevButton);
    await waitFor(() => {
      expect(screen.getByTestId('mock-course-detail-map')).toHaveTextContent(
        'Current Index: 0'
      );
    });
  });
});
