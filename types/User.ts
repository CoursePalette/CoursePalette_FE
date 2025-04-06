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
