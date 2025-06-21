import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Weather API Dashboard',
  description: 'A comprehensive weather data API with modern frontend built with Next.js',
  keywords: ['weather', 'api', 'dashboard', 'nextjs', 'react'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700">
          {children}
        </div>
      </body>
    </html>
  );
}
