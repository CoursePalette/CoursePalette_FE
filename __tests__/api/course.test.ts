import {
  createCourse,
  deleteCourse,
  getCourseDetail,
  getCourseEditData,
  getMyCourses,
  getMyFavoriteCourses,
  registCourseFavorite,
  unfavoriteCourse,
  updateCourse,
} from '@/apis/course';
import { CreateCourseRequestDto } from '@/types/Course';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('course Api', () => {
  it('createCourse 함수 데이터 반환', async () => {
    const courseData: CreateCourseRequestDto = {
      title: 'Test',
      category: 'Test',
      places: [],
    };
    mockedAxios.post.mockResolvedValueOnce({
      data: { courseId: 1, message: '코스 등록 성공' },
    });
    const result = await createCourse(courseData);
    expect(result).toEqual({ courseId: 1, message: '코스 등록 성공' });
    expect(mockedAxios.post).toHaveBeenCalledWith('/course', courseData);
  });

  it('getCourseDetail 상세 데이터 반환', async () => {
    const detailData = { places: [] };
    mockedAxios.get.mockResolvedValueOnce({ data: detailData });
    const result = await getCourseDetail({ courseId: '123' });
    expect(result).toEqual(detailData);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/course/detail/123`);
  });

  it('registerCourseFavorite 즐겨찾기 결과 반환', async () => {
    const favData = { message: '코스를 즐겨찾기 했습니다!' };
    mockedAxios.post.mockResolvedValueOnce({ data: favData });
    const result = await registCourseFavorite({ courseId: 1 });
    expect(result).toEqual(favData);
    expect(mockedAxios.post).toHaveBeenCalledWith('/course/favorite', {
      courseId: 1,
    });
  });

  it('getMyCourses 코스 목록 반환', async () => {
    const courses = [
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
      {
        courseId: 2,
        user: {
          userId: 2,
          nickname: 'anotherUser',
          profileImageUrl: 'https://example.com/another_profile.jpg',
        },
        title: '또 다른 코스',
        category: '혼자서',
        favorite: 5,
        createdAt: '2023-01-02T12:00:00Z',
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: courses });
    const result = await getMyCourses();
    expect(result).toEqual(courses);
    expect(mockedAxios.get).toHaveBeenCalledWith('course/mycourse');
  });

  it('deleteCourse 삭제 결과 반환', async () => {
    const delData = { message: '코스를 성공적으로 삭제했습니다!' };
    mockedAxios.delete.mockResolvedValueOnce({ data: delData });
    const result = await deleteCourse({ courseId: 1 });
    expect(result).toEqual(delData);
    expect(mockedAxios.delete).toHaveBeenCalledWith('/course/1');
  });

  it('getCourseEditData 코스 수정 전 데이터 반환', async () => {
    const editData = { title: 'Test', category: 'Test', places: [] };
    mockedAxios.get.mockResolvedValueOnce({ data: editData });
    const result = await getCourseEditData(1);
    expect(result).toEqual(editData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/course/edit/1');
  });

  it('updateCourse 수정 결과 반환', async () => {
    const updateData = { courseId: 1, message: '코스 수정 완료' };

    // axios.create()가 호출되어 반환되는 인스턴스에 모킹해야함.
    const instance = (axios.create as jest.Mock).mock.results[0].value;
    instance.put.mockResolvedValueOnce({ data: updateData });

    const result = await updateCourse(1, {
      title: 'Test',
      category: 'Test',
      places: [],
    });
    expect(result).toEqual(updateData);
    expect(instance.put).toHaveBeenCalledWith('/course/1', {
      title: 'Test',
      category: 'Test',
      places: [],
    });
  });

  it('getMyFavoriteCourses 즐겨찾기 코스 목록 반환', async () => {
    const favCourses = [
      {
        courseId: 3,
        user: {
          userId: 3,
          nickname: 'favUser',
          profileImageUrl: 'https://example.com/fav_profile.jpg',
        },
        title: '즐겨찾기 코스',
        category: '가족들과',
        favorite: 15,
        createdAt: '2023-01-03T12:00:00Z',
      },
      {
        courseId: 4,
        user: {
          userId: 3,
          nickname: 'favUser',
          profileImageUrl: 'https://example.com/fav_profile.jpg',
        },
        title: '즐겨찾기 코스',
        category: '가족들과',
        favorite: 65,
        createdAt: '2023-01-03T12:00:00Z',
      },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: favCourses });
    const result = await getMyFavoriteCourses();
    expect(result).toEqual(favCourses);
    expect(mockedAxios.get).toHaveBeenCalledWith('/course/myfavorite');
  });

  it('unfavorite 즐겨찾기 해제 결과 반환', async () => {
    const unfavData = { message: '코스 즐겨찾기를 해제했습니다.' };
    mockedAxios.delete.mockResolvedValueOnce({ data: unfavData });
    const result = await unfavoriteCourse(1);
    expect(result).toEqual(unfavData);
    expect(mockedAxios.delete).toHaveBeenCalledWith('/course/favorite/1');
  });
});
