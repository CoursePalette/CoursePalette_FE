import ModalHeader from '@/components/atoms/ModalHeader';
import Map from '@/components/organisms/Map';

export default function Home() {
  return (
    <main className='w-full h-full relative'>
      <ModalHeader />
      <Map />
    </main>
  );
}
