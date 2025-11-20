"use client";
import Link from "next/link";

export default function NoteDetails() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Note Title Here</h1>

        <div className="flex gap-3">
          <Link
            href="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Edit
          </Link>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="text-gray-600 mt-2">Created: 12 Nov 2025</p>
      <p className="text-gray-600 mb-6">Updated: 15 Nov 2025</p>

      <div className="bg-white p-6 rounded-lg shadow">
        <p>
          This is the full note description. When you click a note from the
          dashboard, you will see the entire content here. Later, this will be
          dynamic using backend data.
        </p>
      </div>
    </div>
  );
}
