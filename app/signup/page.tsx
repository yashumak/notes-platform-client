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
      await axios.post(
        "/api/auth/register",
        {
          name,
          email,
          password,
          university,
          course: branch,
          year,
        },
        { withCredentials: true }
      );

      window.location.href = "/dashboard";
    } catch (error: unknown) {
      console.error(error);
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      alert(message || "Registration failed");
    }
  };

  return (
    <div className="mt-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-4xl rounded-xl border border-slate-700 border-t-2 border-t-fuchsia-400 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/40 sm:p-8">
        <p className="mb-3 text-center text-sm font-semibold uppercase text-fuchsia-300">Join NotesHub</p>
        <h1 className="mb-3 text-center text-3xl font-bold text-white">Create Account</h1>
        <p className="mb-8 text-center text-slate-400">
          Set up your student profile to share and discover study materials.
        </p>

        {/* 2 Column Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-7 gap-y-6 md:grid-cols-2">

          {/* Full Name */}
          <div>
            <label className="font-medium text-slate-200">Full Name</label>
            <input
              type="text"
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            {errors.name && <p className="mt-2 text-sm text-rose-300">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="font-medium text-slate-200">Email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="mt-2 text-sm text-rose-300">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="font-medium text-slate-200">Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-rose-300">{errors.password}</p>
            )}
            {password.length > 0 && password.length < 7 && (
              <p className="mt-2 text-sm text-rose-300">Password must be at least 7 characters.</p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="font-medium text-slate-200">Year</label>
            <select
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
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
              <p className="mt-2 text-sm text-rose-300">{errors.year}</p>
            )}
          </div>

          {/* University */}
          <div className="col-span-1 md:col-span-2">
            <label className="font-medium text-slate-200">University/College</label>
            <input
              type="text"
              value={uniSearch}
              onChange={(e) => {
                setUniSearch(e.target.value);
                setShowUniList(true);
              }}
              onFocus={() => setShowUniList(true)}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="Search university"
            />

            {showUniList && (
              <ul className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-slate-600 bg-slate-800 shadow-xl">
                {universities
                  .filter((u) =>
                    u.toLowerCase().includes(uniSearch.toLowerCase())
                  )
                  .map((u, i) => (
                    <li
                      key={i}
                      className="cursor-pointer px-4 py-2 text-slate-200 transition-colors hover:bg-slate-700 hover:text-cyan-200"
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
              <p className="mt-2 text-sm text-rose-300">{errors.university}</p>
            )}
          </div>

          {/* Branch */}
          <div className="col-span-1 md:col-span-2">
            <label className="font-medium text-slate-200">Branch</label>
            <input
              type="text"
              value={branchSearch}
              onChange={(e) => {
                setBranchSearch(e.target.value);
                setShowBranchList(true);
              }}
              onFocus={() => setShowBranchList(true)}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="Search branch"
            />

            {showBranchList && (
              <ul className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-slate-600 bg-slate-800 shadow-xl">
                {branches
                  .filter((b) =>
                    b.toLowerCase().includes(branchSearch.toLowerCase())
                  )
                  .map((b, i) => (
                    <li
                      key={i}
                      className="cursor-pointer px-4 py-2 text-slate-200 transition-colors hover:bg-slate-700 hover:text-cyan-200"
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
              <p className="mt-2 text-sm text-rose-300">{errors.branch}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 p-3 font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Register
            </button>

            <p className="mt-5 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-cyan-300 transition-colors hover:text-cyan-200 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
