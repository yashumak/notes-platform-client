"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function SignupPage() {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");

  const [uniSearch, setUniSearch] = useState("");
  const [showUniList, setShowUniList] = useState(false);
  const [branchSearch, setBranchSearch] = useState("");
  const [showBranchList, setShowBranchList] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [universities, setUniversities] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/engineeringData.json");
        const data = await response.json();
        setUniversities(data.colleges);
        setBranches(data.branches);
      } catch (error) {
        console.error("Error fetching engineering data:", error);
      }
    };
    fetchData();
  }, []);

  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (!university.trim()) newErrors.university = "University is required.";
    if (!branch.trim()) newErrors.branch = "Branch is required.";
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
          name,
          email,
          password,
          university,
          course: branch,
          year,
        }
      );

      alert("Registration successful!");
      window.location.href = "/";
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 mt-10">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-4">Create Account</h1>
        <p className="text-center text-gray-600 mb-6">
          Fill the details below
        </p>

        {/* 2 Column Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div>
            <label className="font-medium">Full Name</label>
            <input
              type="text"
              className="w-full p-3 mt-1 border rounded-md"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
            {password.length > 0 && password.length < 7 && (
              <p className="text-red-500 text-sm">Password must be at least 7 characters.</p>
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

          {/* University */}
          <div className="col-span-1 md:col-span-2">
            <label className="font-medium">University/Collage</label>
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

          {/* Branch */}
          <div className="col-span-1 md:col-span-2">
            <label className="font-medium">Branch</label>
            <input
              type="text"
              value={branchSearch}
              onChange={(e) => {
                setBranchSearch(e.target.value);
                setShowBranchList(true);
              }}
              onFocus={() => setShowBranchList(true)}
              className="w-full p-3 mt-1 border rounded-md"
              placeholder="Search branch"
            />

            {showBranchList && (
              <ul className="border rounded-md mt-2 max-h-40 overflow-y-auto bg-white shadow-lg">
                {branches
                  .filter((b) =>
                    b.toLowerCase().includes(branchSearch.toLowerCase())
                  )
                  .map((b, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setBranchSearch(b);
                        setBranch(b);
                        setShowBranchList(false);
                      }}
                    >
                      {b}
                    </li>
                  ))}
              </ul>
            )}
            {errors.branch && (
              <p className="text-red-500 text-sm">{errors.branch}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
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
          </div>
        </form>
      </div>
    </div>
  );
}
