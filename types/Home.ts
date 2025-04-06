import { CourseSimpleDto } from './Course';
import { PlaceDto } from './Place';

export interface HomeResponseDto {
  courses: CourseSimpleDto[];
  places: PlaceDto[];
}
