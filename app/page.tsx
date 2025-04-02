import CourseCreateButton from '@/components/atoms/CourseCreateButton';
import ModalHeader from '@/components/atoms/ModalHeader';
import Map from '@/components/organisms/Map';

export default function Home() {
  return (
    <main className='w-full h-full relative'>
      <ModalHeader />
      <Map />
      <CourseCreateButton />
    </main>
  );
}
