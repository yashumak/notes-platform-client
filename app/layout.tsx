import "./globals.css";
import RouteChrome from "./components/RouteChrome";
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
          <ToastNotifications />
          <RouteChrome>{children}</RouteChrome>
        </AppProviders>
      </body>
    </html>
  );
}
