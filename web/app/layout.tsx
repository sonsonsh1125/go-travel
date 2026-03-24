import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Go-Travel - AI 여행지 장소 추출기",
  description: "YouTube 영상에서 AI로 여행지 정보를 자동 추출하여 Notion에 정리합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gradient-to-br from-purple-600 to-indigo-700 min-h-screen">
        {children}
      </body>
    </html>
  );
}
