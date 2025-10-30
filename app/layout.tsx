import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Remind+",
  description: "Colorful team reminders with Supabase & Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> 
        {/** Auth provider wraps the app to provide session */}
        {/* eslint-disable-next-line react/no-unknown-property */}
        {/* @ts-expect-error Server Components wrap client providers */}
        {/** In Next.js App Router, a client provider can be rendered here */}
        {/* Keeping minimal comments per guidelines */}
        <AuthRoot>{children}</AuthRoot>
        {/* Theme Toggle floating button */}
        {/* @ts-expect-error Client component in server layout */}
        <ThemeToggle />
      </body>
    </html>
  );
}

// Client boundary for AuthProvider
import { AuthProvider } from "../contexts/AuthContext"
import ThemeToggle from "../components/ThemeToggle"
function AuthRoot({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
