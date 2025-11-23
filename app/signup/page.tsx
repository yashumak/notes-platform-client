'use client';

import { useEffect, useState } from "react";

export default function SignupPage() {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);

  const [uniSearch, setUniSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  const [showUniList, setShowUniList] = useState(false);
  const [showCourseList, setShowCourseList] = useState(false);

  // ✅ Load JSON automatically from public folder
  useEffect(() => {
    fetch("/data/engineeringData.json")
      .then((res) => res.json())
      .then((data) => {
        setUniversities(data.colleges || []);
        setCourses(data.branches || []);
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // Filter logic
  const filteredUniversities = universities.filter((u) =>
    u.toLowerCase().startsWith(uniSearch.toLowerCase())
  );

  const filteredCourses = courses.filter((c) =>
    c.toLowerCase().startsWith(courseSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 mt-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">

        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Join the notes community</p>

        <form className="space-y-6">

          {/* NAME + EMAIL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 text-sm font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* UNIVERSITY + COURSE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* UNIVERSITY */}
            <div className="relative">
              <label className="block mb-1 text-sm font-medium">College / University</label>

              <input
                type="text"
                placeholder="Search & select your college"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={uniSearch}
                onChange={(e) => {
                  setUniSearch(e.target.value);
                  setShowUniList(true);
                }}
                onFocus={() => setShowUniList(true)}
              />

              {showUniList && (
                <ul className="absolute z-10 w-full bg-white border shadow-lg max-h-56 overflow-y-auto rounded-lg mt-1">
                  {filteredUniversities.length > 0 ? (
                    filteredUniversities.map((uni, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          setUniSearch(uni);
                          setShowUniList(false);
                        }}
                      >
                        {uni}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">No matches found</li>
                  )}
                </ul>
              )}
            </div>

            {/* BRANCH */}
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

          {/* PASSWORD + YEAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Year</label>
              <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select your year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>5th Year+</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Account
          </button>

        </form>

      </div>
    </div>
  );
}
