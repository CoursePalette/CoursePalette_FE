import * as courseApi from '@/api/course';
import CourseEditPage from '@/app/course/edit/[id]/page';
import { useCreateCourseStore } from '@/store/course/useCreateCourseStore';
import { CreateCourseRequestDto } from '@/types/Course';
import { Place } from '@/types/Place';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as nextAuthReact from 'next-auth/react';
import Swal from 'sweetalert2';

import * as navigation from 'next/navigation';

import React from 'react';

import * as checkLoginUtil from '@/lib/checkLogin';

// --- 모킹 설정 ---
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useSession: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(), // Header 등에서 사용될 수 있으므로 모킹
}));
jest.mock('@/api/course');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));
jest.mock('@/lib/checkLogin');

// 모킹 구현
const mockUseSession = nextAuthReact.useSession as jest.Mock;
const mockUseRouter = navigation.useRouter as jest.Mock;
const mockUsePathname = navigation.usePathname as jest.Mock; // 필요시
const mockGetCourseEditData = courseApi.getCourseEditData as jest.Mock;
const mockUpdateCourse = courseApi.updateCourse as jest.Mock;
const mockSwalFire = Swal.fire as jest.Mock;
const mockCheckLogin = checkLoginUtil.checkLogin as jest.Mock;

// 각 테스트 전 Zustand 스토어 초기화
const initialStoreState = useCreateCourseStore.getState();
beforeEach(() => {
  useCreateCourseStore.setState(initialStoreState, true); // 스토어 리셋
});

describe('CourseEditPage', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  let mockRouterPush: jest.Mock;
  let mockRouterBack: jest.Mock;
  let mockRouterReplace: jest.Mock;

  // 기본 수정 전 데이터
  const courseId = 123;
  const mockEditData: CreateCourseRequestDto = {
    title: '기존 코스 제목',
    category: '데이트',
    places: [
      {
        placeId: 'p1',
        name: '기존 장소1',
        address: '주소1',
        latitude: '1',
        longitude: '1',
        placeUrl: 'url1',
        sequence: 1,
      },
      {
        placeId: 'p2',
        name: '기존 장소2',
        address: '주소2',
        latitude: '2',
        longitude: '2',
        placeUrl: 'url2',
        sequence: 2,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // 기본 인증된 세션 설정
    mockUseSession.mockReturnValue({
      data: { user: { backendJwt: 'sample-token', userId: 1 } },
      status: 'authenticated',
      update: jest.fn(),
    });

    // 라우터 모킹 설정
    mockRouterPush = jest.fn();
    mockRouterBack = jest.fn();
    mockRouterReplace = jest.fn(); // replace 모킹
    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
      back: mockRouterBack,
      replace: mockRouterReplace, // replace 추가
    });
    mockUsePathname.mockReturnValue(`/course/edit/${courseId}`);

    // 기본 Swal 모킹 설정
    mockSwalFire.mockResolvedValue({ isConfirmed: true });

    // 기본 API 모킹 (성공)
    mockGetCourseEditData.mockResolvedValue(mockEditData);
    mockUpdateCourse.mockResolvedValue({
      courseId: courseId,
      message: '코스 수정 완료',
    });
  });

  // 컴포넌트 렌더링 헬퍼 함수
  const renderComponent = () => {
    // page 컴포넌트는 params를 prop으로 받음
    return render(
      <QueryClientProvider client={queryClient}>
        <CourseEditPage params={{ id: String(courseId) }} />
      </QueryClientProvider>
    );
  };

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
        expect.objectContaining({ back: expect.any(Function) })
      );
    });
  });

  it('초기 데이터 로딩 중 로딩 컴포넌트를 표시해야 한다', () => {
    // getCourseEditData가 즉시 resolve되지 않도록 설정
    // 또는 컴포넌트의 초기 loading 상태를 확인
    mockGetCourseEditData.mockImplementation(() => new Promise(() => {})); // Pending promise
    renderComponent();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('데이터 로딩 성공 시 필드와 장소 목록이 초기화되어야 한다', async () => {
    renderComponent();

    // 로딩 사라짐 확인
    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    );

    // 제목 확인
    expect(
      screen.getByPlaceholderText('ex) 혼자서 성수동 즐기는 코스')
    ).toHaveValue(mockEditData.title);

    // 카테고리 확인 (값으로 확인)
    expect(
      screen.getByRole('combobox', { name: /코스 카테고리/i })
    ).toHaveTextContent(`#${mockEditData.category}`); // '#' 추가 확인

    // 장소 목록 확인
    expect(screen.getByText(/#1 기존 장소1/)).toBeInTheDocument();
    expect(screen.getByText(/#2 기존 장소2/)).toBeInTheDocument();

    // 스토어 상태 확인
    expect(useCreateCourseStore.getState().title).toBe(mockEditData.title);
    expect(useCreateCourseStore.getState().category).toBe(
      mockEditData.category
    );
    expect(useCreateCourseStore.getState().places.length).toBe(2);
    expect(useCreateCourseStore.getState().places[0].place_name).toBe(
      '기존 장소1'
    );
  });

  it('데이터 로딩 실패 시 에러 메시지를 표시하고 뒤로가기 해야 한다', async () => {
    const fetchError = new Error('Failed to fetch edit data');
    mockGetCourseEditData.mockRejectedValue(fetchError);
    renderComponent();

    await waitFor(() => {
      expect(mockSwalFire).toHaveBeenCalledWith(
        '데이터 불러오기 실패',
        '코스 정보를 불러오지 못했습니다.',
        'error'
      );
    });

    // Swal 확인 후 뒤로가기 호출 확인
    expect(mockRouterBack).toHaveBeenCalledTimes(1);
  });

  it('제목, 카테고리 수정 시 스토어 상태가 업데이트되어야 한다', async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    ); // 데이터 로딩 완료 기다림
    const user = userEvent.setup();

    // 제목 수정
    const titleInput =
      screen.getByPlaceholderText('ex) 혼자서 성수동 즐기는 코스');
    await user.clear(titleInput);
    await user.type(titleInput, '새로운 코스 제목');
    expect(titleInput).toHaveValue('새로운 코스 제목');
    expect(useCreateCourseStore.getState().title).toBe('새로운 코스 제목');

    // 카테고리 수정
    const categoryTrigger = screen.getByRole('combobox', {
      name: /코스 카테고리/i,
    });
    await user.click(categoryTrigger);
    await user.click(await screen.findByRole('option', { name: '#친구들과' }));
    expect(categoryTrigger).toHaveTextContent('#친구들과');
    expect(useCreateCourseStore.getState().category).toBe('친구들과');
  });

  it('장소 개수가 2개 미만이거나 제목/카테고리가 없으면 수정 버튼이 비활성화된다', async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    );
    const user = userEvent.setup();
    const registerButton = screen.getByRole('button', { name: '등록' });

    // 초기 상태 (활성화 가정)
    expect(registerButton).not.toBeDisabled();

    // 장소 1개 삭제 (2개 -> 1개)
    const deleteButtons = screen.getAllByRole('button', { name: '삭제' });
    expect(deleteButtons.length).toBe(2); // 초기 장소 2개 확인
    await act(async () => {
      // act로 상태 변경 감싸기
      await user.click(deleteButtons[0]);
    });

    // 장소 1개 남았으므로 비활성화 확인
    expect(registerButton).toBeDisabled();

    // 다시 장소 추가 (간단하게 store 직접 조작)
    await act(async () => {
      const place3: Place = {
        id: 'p3',
        place_name: '새 장소',
        address_name: '주소3',
        latitude: '3',
        longitude: '3',
        place_url: 'url3',
      };
      useCreateCourseStore.getState().addPlace(place3); // 장소 2개로 복귀
    });
    await waitFor(() => expect(registerButton).not.toBeDisabled()); // 다시 활성화 확인

    // 제목 비우기
    const titleInput =
      screen.getByPlaceholderText('ex) 혼자서 성수동 즐기는 코스');
    await user.clear(titleInput);
    expect(registerButton).toBeDisabled(); // 비활성화 확인

    // 제목 다시 채우기
    await user.type(titleInput, '다시 제목 채움');
    await waitFor(() => expect(registerButton).not.toBeDisabled()); // 다시 활성화 확인
  });

  it('성공적으로 코스 수정 시 API 호출, 성공 메시지 표시, mycourse 페이지로 이동해야 한다', async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    );
    const user = userEvent.setup();

    // 데이터 수정 (제목만 수정)
    const titleInput =
      screen.getByPlaceholderText('ex) 혼자서 성수동 즐기는 코스');
    await user.clear(titleInput);
    await user.type(titleInput, '수정된 코스 제목');

    const registerButton = screen.getByRole('button', { name: '등록' });
    expect(registerButton).not.toBeDisabled();
    await user.click(registerButton);

    // API 호출 확인
    await waitFor(() => {
      expect(mockUpdateCourse).toHaveBeenCalledTimes(1);
      expect(mockUpdateCourse).toHaveBeenCalledWith(
        courseId,
        expect.objectContaining({
          title: '수정된 코스 제목', // 수정된 제목
          category: mockEditData.category,
          places: expect.arrayContaining([
            expect.objectContaining({ placeId: 'p1', sequence: 1 }),
            expect.objectContaining({ placeId: 'p2', sequence: 2 }),
          ]),
        })
      );
    });

    // 성공 Swal 확인
    await waitFor(() => {
      expect(mockSwalFire).toHaveBeenCalledWith(
        '완료',
        '코스가 수정되었습니다.',
        'success'
      );
    });

    // 페이지 이동 확인 (/course/mycourse로 replace)
    expect(mockRouterReplace).toHaveBeenCalledTimes(1);
    expect(mockRouterReplace).toHaveBeenCalledWith('/course/mycourse');
  });

  it('코스 수정 실패 시 API 호출 및 에러 메시지를 표시해야 한다', async () => {
    const updateError = new Error('Update failed');
    mockUpdateCourse.mockRejectedValue(updateError);
    renderComponent();
    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    );
    const user = userEvent.setup();

    const registerButton = screen.getByRole('button', { name: '등록' });
    expect(registerButton).not.toBeDisabled(); // 초기 상태는 활성화
    await user.click(registerButton);

    // API 호출 확인
    await waitFor(() => {
      expect(mockUpdateCourse).toHaveBeenCalledTimes(1);
    });

    // 에러 Swal 확인
    await waitFor(() => {
      expect(mockSwalFire).toHaveBeenCalledWith(
        '오류',
        '코스 수정 중 오류 발생',
        'error'
      );
    });

    // 페이지 이동 없는지 확인
    expect(mockRouterReplace).not.toHaveBeenCalled();
    expect(mockRouterPush).not.toHaveBeenCalled();

    // 스토어 상태 유지 확인
    expect(useCreateCourseStore.getState().title).toBe(mockEditData.title);
  });

  it('취소 버튼 클릭 시 이전 페이지로 이동해야 한다', async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    );
    const user = userEvent.setup();

    const cancelButton = screen.getByRole('button', { name: '취소' });
    await user.click(cancelButton);

    // router.back 호출 확인
    expect(mockRouterBack).toHaveBeenCalledTimes(1);
  });
});
