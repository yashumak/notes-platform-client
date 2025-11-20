"use client";

import { useState } from "react";

export default function UploadNotesPage() {
  const [progress, setProgress] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-4">Upload Notes</h2>
        <p className="text-gray-600 mb-6">Share your study materials with everyone.</p>

        <form className="space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter notes title"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Short description about the notes"
              className="w-full border rounded-lg px-4 py-3 h-24 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500">
              <option>-- Select Category --</option>
              <option>Computer Science</option>
              <option>Electronics</option>
              <option>Mechanical</option>
              <option>Civil</option>
              <option>IT</option>
            </select>
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              type="text"
              placeholder="e.g. DSA, Notes, Semester 3"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload File</label>
            <input
              type="file"
              className="w-full border rounded-lg px-4 py-3 bg-gray-50 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-lg"
              onChange={() => setProgress(40)} // dummy progress
            />
          </div>

          {/* Upload Progress */}
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-lg h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Submit Button */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Upload Notes
          </button>

        </form>
      </div>
    </div>
  );
}
