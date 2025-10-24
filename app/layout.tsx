import './globals.css';
import { ModalProvider } from './contexts/ModalContext';

export const metadata = {
  title: 'Wanderlust - Travel Explorer',
  description: 'Khám phá thế giới với Wanderlust. Tạo lịch trình du lịch hoàn hảo phù hợp với ngân sách và sở thích của bạn.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?display=swap&family=Plus+Jakarta+Sans:wght@400;500;700;800" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
      </head>
      <body className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  )
}
