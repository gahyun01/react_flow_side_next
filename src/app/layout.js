// Desc : 최상위 레이아웃 컴포넌트인 RootLayout을 정의하는 코드이다.

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });  // 'Inter' 폰트를 'latin' 서브셋으로 불러옴

export const metadata = {  // 페이지 메타데이터를 설정하는 객체
  title: "VoiceFlow",  // 브라우저 탭에 표시될 제목 설정
  description: "Implemented voice VoiceFlow",  // 페이지 설명 설정
};

export default function RootLayout({ children }) {  // 기본 레이아웃을 정의하는 RootLayout 컴포넌트
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body> {/* 'Inter' 폰트를 body에 적용 && 페이지 내용을 children으로 렌더링 */}
    </html>
  );
}