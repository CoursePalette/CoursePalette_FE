import { ReactNode } from 'react';


export default function CourseLayout({children} : {children: ReactNode}) {
  return (
    <div>
      
      {/* 헤더 */}
      {children}
    </div>
  )
}