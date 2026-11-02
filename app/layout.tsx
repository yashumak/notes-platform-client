import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastNotifications from "./components/ToastNotifications";
import AppProviders from "./providers";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AppProviders>
          <Navbar />
          <ToastNotifications />
          <main className="flex-grow w-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
