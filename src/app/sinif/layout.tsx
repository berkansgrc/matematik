
"use client";

import { Header } from '@/components/header';
import { usePathname } from 'next/navigation';


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCourseContentPage = pathname.includes('/courses/') && new URLSearchParams(window.location.search).has('contentId');

  // Do not render the default header if it's a specific content page, 
  // as that page renders its own header.
  const showHeader = !isCourseContentPage;


  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
