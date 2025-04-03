import { PlaceWithCoursesResponseDto } from '@/types/Place';

import { axiosServer } from '../axiosInstance';

export async function getPlaceWithCourses({
  placeId,
}: {
  placeId: string;
}): Promise<PlaceWithCoursesResponseDto> {
  const response = await axiosServer.get<PlaceWithCoursesResponseDto>(
    `/place/${placeId}`
  );

  return response.data;
}
