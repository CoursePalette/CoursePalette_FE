import MypagePage from '@/app/mypage/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';

import { checkLogin } from '@/lib/checkLogin';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

jest.mock('@/lib/checkLogin', () => ({
  checkLogin: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, ...rest }: { src?: string; [key: string]: any }) => {
    return (
      <img
        src={src || '/images/default.png'}
        alt='유저 프로필 이미지'
        {...rest}
      />
    );
  },
}));

describe('MypagePage', () => {
  const queryClient = new QueryClient();
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MypagePage />
      </QueryClientProvider>
    );
  };

  it('로그인되지 않은 상태라면 checkLogin 호출한다', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    renderComponent();

    await waitFor(() => {
      expect(checkLogin).toHaveBeenCalled();
    });
  });

  it('로그인 상태라면 닉네임과 프로필 사진이 정상적으로 표시된다.', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          backendJwt: 'fake-jwt',
          nickname: '테스트유저',
          profileImageUrl: 'https://via.placeholder.com/150',
        },
      },
      status: 'authenticated',
    });

    renderComponent();

    // 마이페이지 타이틀이 보인다.
    expect(screen.getByText(/마이페이지/i)).toBeInTheDocument();

    // 닉네임 인풋에 세션 닉네임이 들어가는지
    const nicknameInput = screen.getByPlaceholderText(
      '닉네임은 1글자 ~ 10글자 입니다.'
    );
    expect(nicknameInput).toHaveValue('테스트유저');

    // 프로필 이미지가 alt="유저 프로필 이미지"로 렌더링 됐는지
    const profileImg = screen.getByAltText(
      '유저 프로필 이미지'
    ) as HTMLImageElement;
    expect(profileImg).toBeInTheDocument();
    expect(profileImg.src).toContain('https://via.placeholder.com/150');
  });

  it('닉네임이나 프로필 변경 없이 등록 버튼 누르면 sweetalert 띄우거나 혹은 비활성화 처리', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          backendJwt: 'fake-jwt',
          nickname: '원래닉네임',
          profileImageUrl: 'https://via.placeholder.com/150',
        },
      },
      status: 'authenticated',
    });

    renderComponent();

    const registerButton = screen.getByRole('button', { name: /등록/i });

    // 닉네임이 기존과 동일하고 새 파일이 없으면 비활성화 or 경고 로직
    // 여기서는 비활성화 체크
    expect(registerButton).toBeDisabled();
  });

  it('닉네임 수정 시 등록 버튼 활성화 ', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          backendJwt: 'fake-jwt',
          nickname: '원래닉네임',
          profileImageUrl: 'https://via.placeholder.com/150',
        },
      },
      status: 'authenticated',
    });
    renderComponent();

    const nicknameInput = screen.getByPlaceholderText(
      '닉네임은 1글자 ~ 10글자 입니다.'
    );
    const registerButton = screen.getByRole('button', { name: /등록/i });

    // 닉네임 수정
    await userEvent.clear(nicknameInput);
    await userEvent.type(nicknameInput, '바뀐닉네임');

    expect(registerButton).not.toBeDisabled();
  });

  it('"취소" 버튼 누르면 이전 페이지로 router.back() 호출', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          backendJwt: 'fake-jwt',
          nickname: '테스트유저',
          profileImageUrl: 'https://via.placeholder.com/150',
        },
      },
      status: 'authenticated',
    });

    renderComponent();

    // "취소" 버튼
    const cancelButton = screen.getByRole('button', { name: /취소/i });
    await userEvent.click(cancelButton);

    expect(mockBack).toHaveBeenCalled();
  });
});
