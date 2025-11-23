"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 shadow-md px-6 py-3 flex items-center justify-between">

      {/* Left Logo */}
      <Link href="/" className="text-3xl font-extrabold text-blue-700 tracking-wide hover:text-blue-800 transition-colors">
        NotesHub
      </Link>

      {/* Center Search Bar */}
      <div className="flex-1 flex justify-center px-6">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search Notes, Assignments, Papers, Que Banks, PPT, Reports..."
            className="w-full px-5 py-2.5 border border-blue-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Links */}
      <div className="flex items-center font-semibold gap-6 text-gray-700">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <Link href="/notes" className="hover:text-blue-600 transition-colors">Notes</Link>

        <Link
          href="/login"
          className="px-5 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-all"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="px-5 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-full shadow hover:bg-blue-50 transition-all"
        >
          Signup
        </Link>

      </div>
    </nav>
  );
}
