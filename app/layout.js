import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Weather App",
  description: "Weather forecast application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.className} h-full antialiased`}>
      {/* 
        1. bg-[#040914]: لون خلفية أساسي داكن لمنع ظهور حواف بيضاء.
        2. radial-gradient مع الألوان المقاربة للتصميم.
      */}
      <body className="min-h-full flex flex-col bg-[#080C24] text-white">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
