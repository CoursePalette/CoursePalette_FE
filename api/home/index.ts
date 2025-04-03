import { HomeResponse } from '@/types/Home';

import { axiosServer } from '../axiosInstance';

export async function getHomeData(
  search?: string,
  category?: string
): Promise<HomeResponse> {
  const response = await axiosServer.get<HomeResponse>('/home', {
    params: { search, category },
  });
  return response.data;
}
