import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import ToastContainer from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TaskFlow — Task Management",
  description: "A modern task management system built with Next.js and MongoDB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-950 text-slate-100 antialiased">
        <ToastProvider>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
