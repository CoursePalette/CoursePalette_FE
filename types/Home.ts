import { CourseSimpleDto } from './Course';
import { PlaceDto } from './Place';

export interface HomeResponse {
  courses: CourseSimpleDto[];
  places: PlaceDto[];
}
