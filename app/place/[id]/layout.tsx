import Header from '@/components/atoms/Header';

import { ReactNode } from 'react';

export default function PlaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className='w-full h-full'>
      <Header />
      {children}
    </div>
  );
}
