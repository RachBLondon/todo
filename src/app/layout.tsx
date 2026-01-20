import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const adigiana = localFont({
  src: "../fonts/AdigianaToyboxRegular.ttf",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "locked in 🔒 - Daily Task & Habit Tracker",
  description: "Stay consistent. Build momentum. Track up to 3 daily tasks and 5 core habits. Weekdays only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} ${adigiana.variable} antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--lofi-tan)',
              color: 'var(--lofi-brown)',
              border: '1px solid var(--lofi-muted)',
            },
            success: {
              iconTheme: {
                primary: 'var(--lofi-accent)',
                secondary: 'var(--lofi-cream)',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
