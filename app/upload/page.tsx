"use client";

import { useEffect, useState } from "react";

export default function UploadNotesPage() {
  const [progress, setProgress] = useState(0);

  // const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);

  // const [uniSearch, setUniSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  // const [showUniList, setShowUniList] = useState(false);
  const [showCourseList, setShowCourseList] = useState(false);

  // ✅ Load JSON automatically from public folder
  useEffect(() => {

    fetch("/data/engineeringData.json")
      .then((res) => res.json())
      .then((data) => {
        // setUniversities(data.colleges || []);
        setCourses(data.branches || []);
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // Filter logic
  // const filteredUniversities = universities.filter((u) =>
  //   u.toLowerCase().startsWith(uniSearch.toLowerCase())
  // );

  const filteredCourses = courses.filter((c) =>
    c.toLowerCase().startsWith(courseSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-15">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-4">Upload Notes</h2>
        <p className="text-gray-600 mb-6">Share your study materials with everyone.</p>

        <form className="space-y-6">

          {/* 2 Columns — Title + Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                placeholder="Enter notes title"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Branch */}
            <div className="relative">
              <label className="block mb-1 text-sm font-medium">Branch / Course</label>

              <input
                type="text"
                placeholder="Search & select your branch"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={courseSearch}
                onChange={(e) => {
                  setCourseSearch(e.target.value);
                  setShowCourseList(true);
                }}
                onFocus={() => setShowCourseList(true)}
              />

              {showCourseList && (
                <ul className="absolute z-10 w-full bg-white border shadow-lg max-h-56 overflow-y-auto rounded-lg mt-1">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          setCourseSearch(course);
                          setShowCourseList(false);
                        }}
                      >
                        {course}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">No matches found</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Full Width — Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Short description about the notes"
              className="w-full border rounded-lg px-4 py-3 h-24 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Type  */}

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <input
              type="text"
              placeholder="e.g. Notes, Assignments, Papers, Que Banks, PPT, Reports, other..."
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* subjects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">Subjects</label>
              <input
                type="text"
                placeholder="e.g. CS, AI, DBMS, CN, OS, other..."
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Upload File</label>
              <input
                type="file"
                className="w-full border rounded-lg px-4 py-3 bg-gray-50 
                file:bg-blue-600 file:text-white 
                file:px-4 file:py-2 file:rounded-lg"
                onChange={() => setProgress(40)} // dummy
              />
            </div>
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
