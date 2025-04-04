import Header from '@/components/atoms/Header';

import { ReactNode } from 'react';

export default function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
