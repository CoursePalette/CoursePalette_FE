export const metadata = {
  title: '메뉴 페이지',
  describe: '내가 등록한 코스, 즐겨찾기한 코스 등 다양한 기능을 사용해보세요!',
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
