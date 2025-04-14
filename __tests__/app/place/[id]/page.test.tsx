import * as placeApi from '@/apis/place';
import PlacePage from '@/app/place/[id]/page';
import { CourseSimpleDto } from '@/types/Course';
import { PlaceWithCoursesResponseDto } from '@/types/Place';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

// API 모듈 모킹
jest.mock('@/apis/place');

// PlaceDetailButton 컴포넌트 모킹
jest.mock('@/components/atoms/PlaceDetailButton', () => {
  // props를 받아서 onClick 핸들러를 연결
  return function MockPlaceDetailButton({ placeUrl }: { placeUrl: string }) {
    return (
      <button
        data-testid='mock-place-detail-button'
        onClick={() => window.open(placeUrl, '_blank', 'noopener,noreferrer')}
      >
        장소 상세 정보 보기
      </button>
    );
  };
});

// CourseBox 컴포넌트 모킹
jest.mock('@/components/molecules/CourseBox', () => {
  return function MockCourseBox({ course }: { course: CourseSimpleDto }) {
    return (
      <div data-testid={`course-box-${course.courseId}`}>
        <h3>{course.title}</h3>
      </div>
    );
  };
});

// window.open 모킹
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', { value: mockWindowOpen });

// 모킹 구현
const mockGetPlaceWithCourses = placeApi.getPlaceWithCourses as jest.Mock;

describe('PlacePage (Server Component)', () => {
  // 기본 테스트 데이터
  const testPlaceId = 'place123';
  const mockPlaceDataWithCourses: PlaceWithCoursesResponseDto = {
    placeId: testPlaceId,
    name: '테스트 장소',
    address: '서울시 테스트구 테스트동 123',
    latitude: '37.5',
    longitude: '127.0',
    placeUrl: 'https://place.map.kakao.com/place123',
    courses: [
      {
        courseId: 1,
        title: '장소 포함 코스 1',
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
        title: '장소 포함 코스 2',
        category: '가족들과',
        favorite: 10,
        createdAt: '2024-01-02',
        user: {
          userId: 2,
          nickname: '유저2',
          profileImageUrl: 'https://example.com/user2.png',
        },
      },
    ],
  };

  const mockPlaceDataWithoutCourses: PlaceWithCoursesResponseDto = {
    ...mockPlaceDataWithCourses,
    courses: [], // 코스 목록이 비어있는 경우
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // 기본적으로 코스가 있는 데이터를 반환하도록 설정
    mockGetPlaceWithCourses.mockResolvedValue(mockPlaceDataWithCourses);
  });

  // Server Component는 async이므로, 테스트 함수도 async로 선언
  it('데이터 로딩 성공 시 장소 정보와 포함된 코스 목록이 렌더링되어야 한다', async () => {
    // Server Component는 props로 params를 받음
    // render 함수는 Promise를 반환하므로 await 사용
    const PageComponent = await PlacePage({ params: { id: testPlaceId } });
    render(<>{PageComponent}</>); // JSX를 직접 렌더링

    // 장소 정보 확인
    expect(
      screen.getByRole('heading', { name: mockPlaceDataWithCourses.name })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockPlaceDataWithCourses.address)
    ).toBeInTheDocument();

    // 모킹된 PlaceDetailButton 확인
    expect(screen.getByTestId('mock-place-detail-button')).toBeInTheDocument();
    expect(screen.getByText('장소 상세 정보 보기')).toBeInTheDocument(); // 버튼 텍스트 확인

    // 모킹된 CourseBox 개수 및 내용 확인
    const courseBoxes = screen.getAllByTestId(/course-box-/); // data-testid 패턴으로 찾기
    expect(courseBoxes).toHaveLength(mockPlaceDataWithCourses.courses.length); // 2개 예상

    // 각 CourseBox의 내용 확인
    expect(screen.getByText('장소 포함 코스 1')).toBeInTheDocument();
    expect(screen.getByText('장소 포함 코스 2')).toBeInTheDocument();
  });

  it('데이터 로딩 성공 시 포함된 코스가 없으면 코스 목록 영역이 비어있어야 한다', async () => {
    // API가 코스 없는 데이터를 반환하도록 설정
    mockGetPlaceWithCourses.mockResolvedValue(mockPlaceDataWithoutCourses);

    const PageComponent = await PlacePage({ params: { id: testPlaceId } });
    render(<>{PageComponent}</>);

    // 장소 정보는 여전히 표시됨
    expect(
      screen.getByRole('heading', { name: mockPlaceDataWithoutCourses.name })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockPlaceDataWithoutCourses.address)
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-place-detail-button')).toBeInTheDocument();

    // CourseBox가 없는지 확인
    expect(screen.queryByTestId(/course-box-/)).not.toBeInTheDocument();
  });

  it('장소 상세 정보 보기 버튼 클릭 시 window.open이 호출되어야 한다', async () => {
    // 코스가 있든 없든 버튼은 렌더링되므로 기본 모킹 사용
    const PageComponent = await PlacePage({ params: { id: testPlaceId } });
    render(<>{PageComponent}</>);
    const user = userEvent.setup();

    // 모킹된 버튼 찾기
    const detailButton = screen.getByTestId('mock-place-detail-button');
    await user.click(detailButton);

    // window.open 호출 확인
    expect(mockWindowOpen).toHaveBeenCalledTimes(1);
    expect(mockWindowOpen).toHaveBeenCalledWith(
      mockPlaceDataWithCourses.placeUrl, // 모킹 데이터의 placeUrl 사용
      '_blank',
      'noopener,noreferrer'
    );
  });
});
