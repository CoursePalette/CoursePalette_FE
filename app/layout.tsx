import type { Metadata } from "next";
import "./globals.css";
import Providers from './Providers';



export const metadata: Metadata = {
  title: "코스팔레트",
  description: "지도 기반 사용자 참여형 코스 추천 및 공유 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
