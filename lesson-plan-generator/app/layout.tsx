import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'مولد خطة الدرس للمعلمين',
  description: 'تعبئة قالب الوزارة وإنتاج ملف DOCX قابل للتنزيل',
  applicationName: 'Lesson Plan Generator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
