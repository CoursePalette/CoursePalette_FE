import { getCourseDetail } from '@/api/course';
import CourseDetailClient from '@/components/organisms/CourseDetailClient';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '코스 상세 페이지',
  description: '코스팔레트 코스 상세 페이지',
};

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = params;

  const data = await getCourseDetail({ courseId: id });

  return (
    <main>
      <CourseDetailClient places={data.places} courseId={Number(id)} />
    </main>
  );
}
