import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsappButton from "@/components/WhatsappButton";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ROOY | Chamarras Premium",
  description:
    "Chamarras premium fabricadas en Puebla. Diseño, calidad y estilo ROOY.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        {/* NAVBAR */}
        <Navbar />

        {/* CONTENIDO */}
        {children}
  <WhatsappButton />


      </body>
    </html>
  );
}
