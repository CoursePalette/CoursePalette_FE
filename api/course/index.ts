import { CreateCourseRequestDto, CreateCourseResponse } from '@/types/\bCourse';

import { axiosClient } from '../axiosInstance';

export async function createCourse(
  courseData: CreateCourseRequestDto
): Promise<CreateCourseResponse> {
  const response = await axiosClient.post<CreateCourseResponse>(
    '/course',
    courseData
  );
  return response.data;
}
