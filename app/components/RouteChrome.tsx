"use client";

import type { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function RouteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow w-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
        {children}
      </main>
      <Footer />
    </>
  );
}
