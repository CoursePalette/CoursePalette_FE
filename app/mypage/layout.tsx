import Header from '@/components/atoms/Header';

export const metadata = {
  title: '마이 페이지',
  describe: '프로필 정보를 수정할 수 있어요!',
};

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full h-full'>
      <Header />
      {children}
    </div>
  );
}
