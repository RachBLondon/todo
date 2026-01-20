import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

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
      <body className="antialiased">
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
