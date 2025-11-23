import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow w-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
