import { HomeResponseDto } from '@/types/Home';

import { axiosServer } from '../axiosInstance';

export async function getHomeData(
  search?: string,
  category?: string
): Promise<HomeResponseDto> {
  const response = await axiosServer.get<HomeResponseDto>('/home', {
    params: { search, category },
  });
  return response.data;
}
