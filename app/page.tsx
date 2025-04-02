import CourseCreateButton from '@/components/atoms/CourseCreateButton';
import ModalHeader from '@/components/atoms/ModalHeader';
import SidebarOpenButton from '@/components/atoms/SidebarOpenButton';
import Categories from '@/components/molecules/Categories';
import SideBar from '@/components/molecules/SideBar';
import Map from '@/components/organisms/Map';

export default function Home() {
  return (
    <main className='w-full h-full relative'>
      <ModalHeader />
      <Map />
      <Categories />
      <SideBar />
      <SidebarOpenButton />
      <CourseCreateButton />
    </main>
  );
}
