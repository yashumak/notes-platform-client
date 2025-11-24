"use client";

import Link from "next/link";

export default function DashboardPage() {
  const student = {
    name: "Yash Patil",
    college: "Rashtrasant Tukadoji Maharaj Nagpur University",
    branch: "Computer Engineering",
    year: "Fall 2025/2026",
  };

  const uploadedNotes = [
    { id: 1, title: "DBMS Unit 1 Notes", desc: "Full handwritten notes" },
    { id: 2, title: "DSA Sorting", desc: "All sorting algorithms" },
  ];

  const downloadedNotes = [
    { id: 1, title: "OS Memory Management", desc: "Easy explanation" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8 mt-20">
        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-2xl font-bold">
          {student.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{student.name}</h1>
          <p className="text-gray-600">Welcome to your dashboard 👋</p>
        </div>
      </div>

      {/* Student Details Section */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">My Studies</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-6">
          <div>
            <p className="text-lg font-semibold">{student.college}</p>
            <p className="text-gray-500 text-sm mt-1">University</p>
          </div>

          <div>
            <p className="text-lg font-semibold">{student.branch}</p>
            <p className="text-gray-500 text-sm mt-1">Branch</p>
          </div>

          <div>
            <p className="text-lg font-semibold">{student.year}</p>
            <p className="text-gray-500 text-sm mt-1">Academic Year</p>
          </div>
        </div>
      </div>

      {/* Uploaded Notes Section */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">My Uploaded Notes</h2>

        {uploadedNotes.length === 0 ? (
          <p className="text-gray-600">No notes uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {uploadedNotes.map((note) => (
              <div key={note.id} className="border p-3 rounded-lg">
                <h4 className="font-semibold">{note.title}</h4>
                <p className="text-sm text-gray-500">{note.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Downloaded Notes Section */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">My Downloaded Notes</h2>

        {downloadedNotes.length === 0 ? (
          <p className="text-gray-600">No downloaded notes yet.</p>
        ) : (
          <div className="space-y-4">
            {downloadedNotes.map((note) => (
              <div key={note.id} className="border p-3 rounded-lg">
                <h4 className="font-semibold">{note.title}</h4>
                <p className="text-sm text-gray-500">{note.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
