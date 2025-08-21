import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krati & Abhishek - A Love Story in Motion",
  description: "An immersive animated journey through our wedding celebrations - from engagement to reception. Experience the magic of our love story with cutting-edge 3D animations and cinematic storytelling.",
  keywords: ["wedding", "animation", "love story", "Indian wedding", "Krati Dubey", "Abhishek Upadhyay"],
  authors: [{ name: "Wedding Website" }],
  openGraph: {
    title: "Krati & Abhishek - A Love Story in Motion",
    description: "Experience our wedding journey through stunning 3D animations and cinematic storytelling",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
