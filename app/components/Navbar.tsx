"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">

      {/* Left Logo */}
      <Link href="/" className="text-2xl font-bold text-blue-600">
        NotesHub
      </Link>

      {/* Center Search Bar */}
      <div className="flex-1 flex justify-center px-6">
        <input
          type="text"
          placeholder="Search Notes, Assignments, Papers, Que Banks, PPT, Reports..."
          // className=" max-w-md px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          className="w-150 px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Right Links */}
      <div className="flex items-center font-bold gap-6 text-gray-700">
        <Link href="/">Home</Link>
        <Link href="/notes">Notes</Link>

        <Link
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Signup
        </Link>

      </div>
    </nav>
  );
}
