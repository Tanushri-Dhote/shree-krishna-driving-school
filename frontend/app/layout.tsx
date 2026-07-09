import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

import LayoutWrapper from "../components/layout/LayoutWrapper";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shree Krishna Driving School",
  description: "Learn driving with certified instructors",
  icons: {
    icon: "/logo-11.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.variable} ${inter.variable}`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        {/* Toast Container */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={false}
          duration={3000}
        />
      </body>
    </html>
  );
}