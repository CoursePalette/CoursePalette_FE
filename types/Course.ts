export interface CoursePlaceRequestDto {
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
  places: CoursePlaceRequestDto[];
}

export interface CreateCourseResponse {
  courseId: number;
  message: string;
}
