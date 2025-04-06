import {
  CourseDetailResponseDto,
  CourseSimpleDto,
  CreateCourseRequestDto,
  CreateCourseResponseDto,
  DeleteCourseResponseDto,
  FavoriteRequestDto,
  FavoriteResponseDto,
} from '@/types/Course';

import { axiosClient, axiosServer } from '../axiosInstance';

export async function createCourse(
  courseData: CreateCourseRequestDto
): Promise<CreateCourseResponseDto> {
  const response = await axiosClient.post<CreateCourseResponseDto>(
    '/course',
    courseData
  );
  return response.data;
}

export async function getCourseDetail({
  courseId,
}: {
  courseId: string;
}): Promise<CourseDetailResponseDto> {
  const response = await axiosServer.get<CourseDetailResponseDto>(
    `/course/detail/${courseId}`
  );
  return response.data;
}

export async function registCourseFavorite({
  courseId,
}: FavoriteRequestDto): Promise<FavoriteResponseDto> {
  const response = await axiosClient.post<FavoriteResponseDto>(
    '/course/favorite',
    { courseId }
  );
  return response.data;
}

export async function getMyCourses(): Promise<CourseSimpleDto[]> {
  const response = await axiosClient.get<CourseSimpleDto[]>('course/mycourse');
  return response.data;
}

export async function deleteCourse({
  courseId,
}: {
  courseId: number;
}): Promise<DeleteCourseResponseDto> {
  const response = await axiosClient.delete<DeleteCourseResponseDto>(
    `/course/${courseId}`
  );
  return response.data;
}

export async function getCourseEditData(
  courseId: number
): Promise<CreateCourseRequestDto> {
  const response = await axiosClient.get<CreateCourseRequestDto>(
    `/course/edit/${courseId}`
  );

  return response.data;
}

export async function updateCourse(
  courseId: number,
  dto: CreateCourseRequestDto
): Promise<CreateCourseResponseDto> {
  const response = await axiosClient.put<CreateCourseResponseDto>(
    `/course/${courseId}`,
    dto
  );
  return response.data;
}

export async function getMyFavoriteCourses(): Promise<CourseSimpleDto[]> {
  const response =
    await axiosClient.get<CourseSimpleDto[]>('/course/myfavorite');

  return response.data;
}

export async function unfavoriteCourse(
  courseId: number
): Promise<FavoriteResponseDto> {
  const response = await axiosClient.delete<FavoriteResponseDto>(
    `/course/favorite/${courseId}`
  );
  return response.data;
}
