export interface CourseSimpleDto {
  courseId: number;
  userId: number;
  title: string;
  category: string;
  favorite: number;
  createdAt: string;
}

export interface PlaceDto {
  placeId: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  placeUrl: string;
}

export interface HomeResponse {
  courses: CourseSimpleDto[];
  places: PlaceDto[];
}
