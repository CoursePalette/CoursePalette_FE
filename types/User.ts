export interface UserDto {
  userId: number;
  nickname: string;
  profileImageUrl: string;
}

export interface KakaoAuthResponseDto {
  token: string;
  userId: number;
  nickname: string;
  profileImageUrl: string;
}

// 사용자 프로필 업데이트 요청시 타입
export interface UpdateProfileRequest {
  nickname: string;
  profileImageUrl: string;
}

export interface UpdateProfileResponse {
  message: string;
}
