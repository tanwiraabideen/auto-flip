import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { auth } from "../../lib/auth";
import { headers } from "next/headers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AutoFlip",
  description: "Automate your car trade.",
};

export default async function RootLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-400 min-h-screen`}
      >
        <Navbar session={session}></Navbar>
        {children}
      </body>
    </html>
  );
}
