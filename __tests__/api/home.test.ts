import { getHomeData } from '@/api/home';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('home Api', () => {
  it('getHomeData 데이터 반환', async () => {
    const homeData = {
      courses: [
        {
          courseId: 1,
          user: {
            userId: 1,
            nickname: 'testUser',
            profileImageUrl: 'https://example.com/profile.jpg',
          },
          title: '홈 테스트 코스',
          category: '테스트',
          favorite: 8,
          createdAt: '2023-01-01T12:00:00Z',
        },
      ],
      places: [
        {
          placeId: '101',
          name: '홈 테스트 장소',
          address: '서울 테스트구',
          latitude: '37.1111',
          longitude: '126.1111',
          placeUrl: 'https://example.com/place101',
        },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: homeData });
    const result = await getHomeData('검색', '카테고리');
    expect(result).toEqual(homeData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/home', {
      params: { search: '검색', category: '카테고리' },
    });
  });
});
