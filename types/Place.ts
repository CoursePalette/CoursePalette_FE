import { CourseSimpleDto } from './Course';

// 카카오 api로부터 받는 응답
export interface PlaceResponseKakao {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  place_url: string;
  distance?: string;
}

export interface Place {
  id: string;
  place_name: string;
  address_name: string;
  place_url: string;
  longitude: string; // x(경도)
  latitude: string; // y (위도)
}

export interface PlaceWithSequence extends Place {
  sequence: number;
}

export interface PlaceDto {
  placeId: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  placeUrl: string;
}

export interface PlaceDtoWithSequence extends PlaceDto {
  sequence: number;
}

export interface PlaceWithCoursesResponseDto extends PlaceDto {
  courses: CourseSimpleDto[];
}
