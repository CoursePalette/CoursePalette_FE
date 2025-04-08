import * as courseApi from '@/api/course';
import CourseCreatePage from '@/app/course/create/page';
import { useCreateCourseStore } from '@/store/course/useCreateCourseStore';
import { Place } from '@/types/Place';
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
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));
jest.mock('@/lib/checkLogin');

//모킹 구현
const mockUseSession = nextAuthReact.useSession as jest.Mock;
const mockUseRouter = navigation.useRouter as jest.Mock;
const mockUsePathname = navigation.usePathname as jest.Mock;
const mockCreateCourse = courseApi.createCourse as jest.Mock;
const mockSwalFire = Swal.fire as jest.Mock;
const mockCheckLogin = checkLoginUtil.checkLogin as jest.Mock;

// 각 테스트 전 Zustand 스토어 초기화
const initialStoreState = useCreateCourseStore.getState();
beforeEach(() => {
  useCreateCourseStore.setState(initialStoreState, true);
});

describe('CourseCreatePage', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  let mockRouterPush: jest.Mock;
  let mockRouterBack: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: { user: { backendJwt: 'sample-token', userId: 1 } },
      status: 'authenticated',
      update: jest.fn(),
    });
    mockRouterPush = jest.fn();
    mockRouterBack = jest.fn();
    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack,
      replace: jest.fn(),
    });
    mockUsePathname.mockReturnValue('/course/create');
    mockSwalFire.mockResolvedValue({ isConfirmed: true });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <CourseCreatePage />
      </QueryClientProvider>
    );
  };

  it('초기 렌더링 시 제목, 요소들이 표시되고 등록 버튼은 비활성화되어야 한다', () => {
    renderComponent();

    expect(screen.getByText('코스 등록 페이지')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('ex) 혼자서 성수동 즐기는 코스')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('combobox', { name: /코스 카테고리/i })
    ).toBeInTheDocument();
    expect(screen.getByText('장소를 검색하세요.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '취소' })).toBeInTheDocument();

    const registerButton = screen.getByRole('button', { name: '등록' });
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toBeDisabled();
  });

  it('제목 입력 및 카테고리 선택 시 상태가 업데이트되어야 한다', async () => {
    renderComponent();
    const user = userEvent.setup();

    const titleInput =
      screen.getByPlaceholderText('ex) 혼자서 성수동 즐기는 코스');
    await user.type(titleInput, '나만의 멋진 코스');
    expect(titleInput).toHaveValue('나만의 멋진 코스');
    expect(useCreateCourseStore.getState().title).toBe('나만의 멋진 코스');

    const categoryTrigger = screen.getByRole('combobox', {
      name: /코스 카테고리/i,
    });
    await user.click(categoryTrigger);
    const categoryOption = await screen.findByRole('option', {
      name: '#데이트',
    });
    await user.click(categoryOption);

    expect(categoryTrigger).toHaveTextContent('#데이트');
    expect(useCreateCourseStore.getState().category).toBe('데이트');
  });

  it('장소를 2개 이상 추가하고 제목과 카테고리가 있으면 등록 버튼이 활성화된다', async () => {
    renderComponent();

    act(() => {
      const place1: Place = {
        id: 'p1',
        place_name: '장소1',
        address_name: '주소1',
        latitude: '1',
        longitude: '1',
        place_url: 'url1',
      };
      const place2: Place = {
        id: 'p2',
        place_name: '장소2',
        address_name: '주소2',
        latitude: '2',
        longitude: '2',
        place_url: 'url2',
      };
      useCreateCourseStore.getState().addPlace(place1);
      useCreateCourseStore.getState().addPlace(place2);
      useCreateCourseStore.getState().setTitle('테스트 제목');
      useCreateCourseStore.getState().setCategory('데이트');
    });

    const registerButton = screen.getByRole('button', { name: '등록' });
    // 상태 변경 후 UI 업데이트를 기다림 (안정성 때문)
    await waitFor(() => expect(registerButton).not.toBeDisabled());

    expect(screen.getByText(/#1 장소1/)).toBeInTheDocument();
    expect(screen.getByText(/#2 장소2/)).toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 상태 초기화 및 이전 페이지로 이동해야 한다', async () => {
    renderComponent();
    const user = userEvent.setup();

    act(() => {
      useCreateCourseStore.getState().setTitle('임시 제목');
      useCreateCourseStore.getState().setCategory('임시 카테고리');
      const place1: Place = {
        id: 'p1',
        place_name: '장소1',
        address_name: '주소1',
        latitude: '1',
        longitude: '1',
        place_url: 'url1',
      };
      useCreateCourseStore.getState().addPlace(place1);
    });

    const cancelButton = screen.getByRole('button', { name: '취소' });
    await user.click(cancelButton);

    expect(mockRouterBack).toHaveBeenCalledTimes(1);
    expect(useCreateCourseStore.getState().title).toBe('');
    expect(useCreateCourseStore.getState().category).toBe('');
    expect(useCreateCourseStore.getState().places).toEqual([]);
  });

  it('성공적으로 코스 등록 시 API 호출, 성공 메시지 표시, 상태 초기화 및 홈으로 이동해야 한다', async () => {
    mockCreateCourse.mockResolvedValue({
      courseId: 123,
      message: '코스 등록 성공',
    });
    mockSwalFire.mockResolvedValue({ isConfirmed: true });

    renderComponent();
    const user = userEvent.setup();

    const titleInput =
      screen.getByPlaceholderText('ex) 혼자서 성수동 즐기는 코스');
    await user.type(titleInput, '성공 테스트 코스');

    const categoryTrigger = screen.getByRole('combobox', {
      name: /코스 카테고리/i,
    });
    await user.click(categoryTrigger);
    const categoryOption = await screen.findByRole('option', {
      name: '#신나는',
    });
    await user.click(categoryOption);

    act(() => {
      const place1: Place = {
        id: 'p1',
        place_name: '장소1',
        address_name: '주소1',
        latitude: '10',
        longitude: '20',
        place_url: 'url1',
      };
      const place2: Place = {
        id: 'p2',
        place_name: '장소2',
        address_name: '주소2',
        latitude: '11',
        longitude: '21',
        place_url: 'url2',
      };
      useCreateCourseStore.getState().addPlace(place1);
      useCreateCourseStore.getState().addPlace(place2);
    });

    const registerButton = screen.getByRole('button', { name: '등록' });

    await waitFor(() => expect(registerButton).not.toBeDisabled());
    await user.click(registerButton);

    await waitFor(() => {
      expect(mockCreateCourse).toHaveBeenCalledTimes(1);
      expect(mockCreateCourse).toHaveBeenCalledWith({
        title: '성공 테스트 코스',
        category: '신나는',
        places: [
          expect.objectContaining({ placeId: 'p1', sequence: 1 }),
          expect.objectContaining({ placeId: 'p2', sequence: 2 }),
        ],
      });
    });

    await waitFor(() => {
      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: '등록 완료',
        })
      );
    });

    expect(useCreateCourseStore.getState().title).toBe('');
    expect(useCreateCourseStore.getState().category).toBe('');
    expect(useCreateCourseStore.getState().places).toEqual([]);
    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('코스 등록 실패 시 API 호출 및 에러 메시지를 표시해야 한다', async () => {
    const apiError = new Error('Network Error');
    mockCreateCourse.mockRejectedValue(apiError);
    mockSwalFire.mockResolvedValue({ isConfirmed: true });

    renderComponent();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText('ex) 혼자서 성수동 즐기는 코스'),
      '실패 테스트 코스'
    );

    const categoryTrigger = screen.getByRole('combobox', {
      name: /코스 카테고리/i,
    });
    await user.click(categoryTrigger);
    await user.click(await screen.findByRole('option', { name: '#가족들과' }));
    act(() => {
      const place1: Place = {
        id: 'p1',
        place_name: '장소1',
        address_name: '주소1',
        latitude: '1',
        longitude: '1',
        place_url: 'url1',
      };
      const place2: Place = {
        id: 'p2',
        place_name: '장소2',
        address_name: '주소2',
        latitude: '2',
        longitude: '2',
        place_url: 'url2',
      };
      useCreateCourseStore.getState().addPlace(place1);
      useCreateCourseStore.getState().addPlace(place2);
    });

    const registerButton = screen.getByRole('button', { name: '등록' });

    await waitFor(() => expect(registerButton).not.toBeDisabled());
    await user.click(registerButton);

    await waitFor(() => {
      expect(mockCreateCourse).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockSwalFire).toHaveBeenCalledWith(
        '오류',
        '코스 등록 중 오류 발생',
        'error'
      );
    });

    expect(mockRouterPush).not.toHaveBeenCalled();
    expect(useCreateCourseStore.getState().title).toBe('실패 테스트 코스');
    expect(useCreateCourseStore.getState().category).toBe('가족들과');
    expect(useCreateCourseStore.getState().places.length).toBe(2);
  });

  it('로그인되지 않은 상태에서 페이지 접근 시 checkLogin이 호출되어야 한다', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });
    renderComponent();
    await waitFor(() => {
      expect(mockCheckLogin).toHaveBeenCalledTimes(1);
      expect(mockCheckLogin).toHaveBeenCalledWith(
        expect.objectContaining({
          push: expect.any(Function),
          back: expect.any(Function),
        })
      );
    });
  });
});
