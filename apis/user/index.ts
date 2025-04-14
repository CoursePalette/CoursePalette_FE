import { PresignedUrlRequest, PresignedUrlResponse } from '@/types/S3';
import { UpdateProfileRequest, UpdateProfileResponse } from '@/types/User';
import axios from 'axios';

import { axiosClient } from '../axiosInstance';

export const getPresignedUrl = async (
  data: PresignedUrlRequest
): Promise<PresignedUrlResponse> => {
  const response = await axiosClient.post<PresignedUrlResponse>(
    '/users/profile/presigned-url',
    data
  );

  return response.data;
};

export const uploadImageToS3 = async (
  presingedUrl: string,
  file: File
): Promise<void> => {
  await axios.put(presingedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};

export const updateUserProfile = async (
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  const response = await axiosClient.put<UpdateProfileResponse>(
    '/users/profile',
    data
  );

  return response.data;
};
