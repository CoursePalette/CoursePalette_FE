import { UserDto } from './User';

// export interface CoursePlaceRequestDto {
//   placeId: string;
//   name: string;
//   address: string;
//   latitude: string;
//   longitude: string;
//   placeUrl: string;
//   sequence: number;
// }

export interface CoursePlaceDto {
  placeId: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  placeUrl: string;
  sequence: number;
}

export interface CreateCourseRequestDto {
  title: string;
  category: string;
  places: CoursePlaceDto[];
}

export interface CreateCourseResponseDto {
  courseId: number;
  message: string;
}

export interface CourseSimpleDto {
  courseId: number;
  user: UserDto;
  title: string;
  category: string;
  favorite: number;
  createdAt: string;
}

export interface CourseDetailResponseDto {
  places: CoursePlaceDto[];
}

export interface FavoriteRequestDto {
  courseId: number;
}

export interface FavoriteResponseDto {
  message: string;
}

export interface DeleteCourseResponseDto {
  message: string;
}
