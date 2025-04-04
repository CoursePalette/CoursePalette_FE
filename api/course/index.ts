import { CreateCourseRequestDto, CreateCourseResponse } from '@/types/Course';

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
