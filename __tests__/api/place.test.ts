import { getPlaceWithCourses } from '@/api/place';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('place Api', () => {
  it('getPlaceWithCourses 장소 및 코스 데이터 반환', async () => {
    const data = {
      placeId: '1',
      name: '테스트 장소',
      address: '서울특별시 테스트구',
      latitude: '37.1234',
      longitude: '126.1234',
      placeUrl: 'https://example.com/place/1',
      courses: [
        {
          courseId: 1,
          user: {
            userId: 1,
            nickname: 'testUser',
            profileImageUrl: 'https://example.com/profile.jpg',
          },
          title: '테스트 코스',
          category: '데이트',
          favorite: 10,
          createdAt: '2023-01-01T12:00:00Z',
        },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data });
    const result = await getPlaceWithCourses({ placeId: '1' });
    expect(result).toEqual(data);
    expect(mockedAxios.get).toHaveBeenCalledWith('/place/1');
  });
});
