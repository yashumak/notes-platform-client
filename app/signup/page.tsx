"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  const [uniSearch, setUniSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [showUniList, setShowUniList] = useState(false);
  const [showCourseList, setShowCourseList] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const universities = [
    "Savitribai Phule Pune University",
    "Mumbai University",
    "Dr. Babasaheb Ambedkar Marathwada University",
    "Shivaji University",
    "Rashtrasant Tukadoji Maharaj Nagpur University",
  ];

  const courses = [
    "Computer Engineering",
    "Information Technology",
    "Electronics Engineering",
    "AIML",
    "Civil Engineering",
    "Mechanical Engineering",
  ];

  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (!university.trim()) newErrors.university = "University is required.";
    if (!course.trim()) newErrors.course = "Course is required.";
    if (!year.trim()) newErrors.year = "Year is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: fullName,
          email,
          password,
          university,
          course,
          year,
        }
      );


      alert("Registration successful!");
      window.location.href = "/login"; // redirect to login page
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Create Account</h1>
        <p className="text-center text-gray-600 mb-6">Fill the details below</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="font-medium">Full Name</label>
            <input
              type="text"
              className="w-full p-3 mt-1 border rounded-md"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 mt-1 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 mt-1 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* University Dropdown */}
          <div>
            <label className="font-medium">University</label>
            <input
              type="text"
              value={uniSearch}
              onChange={(e) => {
                setUniSearch(e.target.value);
                setShowUniList(true);
              }}
              onFocus={() => setShowUniList(true)}
              className="w-full p-3 mt-1 border rounded-md"
              placeholder="Search university"
            />

            {showUniList && (
              <ul className="border rounded-md mt-2 max-h-40 overflow-y-auto bg-white shadow-lg">
                {universities
                  .filter((u) =>
                    u.toLowerCase().includes(uniSearch.toLowerCase())
                  )
                  .map((u, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setUniSearch(u);
                        setUniversity(u);
                        setShowUniList(false);
                      }}
                    >
                      {u}
                    </li>
                  ))}
              </ul>
            )}
            {errors.university && (
              <p className="text-red-500 text-sm">{errors.university}</p>
            )}
          </div>

          {/* Course Dropdown */}
          <div>
            <label className="font-medium">Course</label>
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => {
                setCourseSearch(e.target.value);
                setShowCourseList(true);
              }}
              onFocus={() => setShowCourseList(true)}
              className="w-full p-3 mt-1 border rounded-md"
              placeholder="Search course"
            />

            {showCourseList && (
              <ul className="border rounded-md mt-2 max-h-40 overflow-y-auto bg-white shadow-lg">
                {courses
                  .filter((c) =>
                    c.toLowerCase().includes(courseSearch.toLowerCase())
                  )
                  .map((c, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setCourseSearch(c);
                        setCourse(c);
                        setShowCourseList(false);
                      }}
                    >
                      {c}
                    </li>
                  ))}
              </ul>
            )}
            {errors.course && (
              <p className="text-red-500 text-sm">{errors.course}</p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="font-medium">Year</label>
            <select
              className="w-full p-3 mt-1 border rounded-md"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {yearOptions.map((y, i) => (
                <option key={i} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {errors.year && (
              <p className="text-red-500 text-sm">{errors.year}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>

          <p className="mt-3 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
