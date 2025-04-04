import { CreateCourseRequestDto, CreateCourseResponse } from '@/types/Course';
import { CourseDetailResponseDto } from '@/types/Course';

import { axiosClient, axiosServer } from '../axiosInstance';

export async function createCourse(
  courseData: CreateCourseRequestDto
): Promise<CreateCourseResponse> {
  const response = await axiosClient.post<CreateCourseResponse>(
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
