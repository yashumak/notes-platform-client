"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useClickOutside } from "../hooks/useClickOutside";

interface UploadResponse {
  success: boolean;
  message?: string;
  url?: string;
}

interface PendingUpload {
  file: File;
  title: string;
  description: string;
  university: string;
  branch: string;
  studyType: string;
  year: string;
}

const pendingUploadDatabase = "noteshub-pending-upload";
const pendingUploadStore = "uploads";

function openPendingUploadDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(pendingUploadDatabase, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(pendingUploadStore);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open saved upload"));
  });
}

async function savePendingUpload(upload: PendingUpload): Promise<void> {
  const database = await openPendingUploadDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(pendingUploadStore, "readwrite");
    transaction.objectStore(pendingUploadStore).put(upload, "pending");
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("Could not save upload details"));
    transaction.onabort = () => reject(transaction.error || new Error("Could not save upload details"));
  }).finally(() => database.close());
}

async function getPendingUpload(): Promise<PendingUpload | undefined> {
  const database = await openPendingUploadDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(pendingUploadStore, "readonly");
    const request = transaction.objectStore(pendingUploadStore).get("pending");
    request.onsuccess = () => resolve(request.result as PendingUpload | undefined);
    request.onerror = () => reject(request.error || new Error("Could not restore saved upload"));
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error("Could not restore saved upload"));
    };
  });
}

async function clearPendingUpload(): Promise<void> {
  const database = await openPendingUploadDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(pendingUploadStore, "readwrite");
    transaction.objectStore(pendingUploadStore).delete("pending");
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("Could not clear saved upload"));
    transaction.onabort = () => reject(transaction.error || new Error("Could not clear saved upload"));
  }).finally(() => database.close());
}

const UploadNote: React.FC = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [university, setUniversity] = useState("");
  const [branch, setBranch] = useState("");
  const [studyType, setStudyType] = useState("");
  const [year, setYear] = useState("");

  const [uniSearch, setUniSearch] = useState("");
  const [showUniList, setShowUniList] = useState(false);
  const universityDropdownRef = useRef<HTMLDivElement>(null);
  const [branchSearch, setBranchSearch] = useState("");
  const [showBranchList, setShowBranchList] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(universityDropdownRef, () => setShowUniList(false), showUniList);
  useClickOutside(branchDropdownRef, () => setShowBranchList(false), showBranchList);

  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const studyTypes: string[] = [
    "Notes",
    "Assignments",
    "Papers",
    "Que Banks",
    "PPT",
    "Reports",
    "Other",
  ];

  const [universities, setUniversities] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/engineeringData.json");
        const data = await response.json();
        setUniversities(data.colleges);
        setBranches(data.branches);
      } catch {
        setUniversities([]);
        setBranches([]);
      }
    };
    fetchData();

    getPendingUpload()
      .then((pendingUpload) => {
        if (!pendingUpload) return;
        setFile(pendingUpload.file);
        setTitle(pendingUpload.title);
        setDescription(pendingUpload.description);
        setUniversity(pendingUpload.university);
        setUniSearch(pendingUpload.university);
        setBranch(pendingUpload.branch);
        setBranchSearch(pendingUpload.branch);
        setStudyType(pendingUpload.studyType);
        setYear(pendingUpload.year);
      })
      .catch(() => {
        setUploadError("Could not restore your saved upload. Please select the file and enter its details again.");
      });
  }, []);

  const years: string[] = [
    "2026", "2025", "2024", "2023", "2022", "2021", "2020",
    "2019", "2018", "2017", "2016", "2015", "2014",
    "2013", "2012", "2011", "2010", "2009", "2008",
    "2007", "2006", "2005", "2004", "2003", "2002",
    "2001", "2000",
  ];

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file.");
      return;
    }

    setUploadError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("university", university);
    formData.append("branch", branch);
    formData.append("studyType", studyType);
    formData.append("year", year);

    try {
      // Use Next.js API rewrite so auth cookie and backend stay on same origin
      const response = await fetch(`/api/notes/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.status === 401) {
        try {
          await savePendingUpload({ file, title, description, university, branch, studyType, year });
          router.replace("/login?redirect=%2Fupload");
        } catch {
          setUploadError("Your browser could not save this file for login. Please try again or sign in in another tab before uploading.");
        }
        return;
      }

      const data: UploadResponse = await response.json();
      if (data.success) {
        await clearPendingUpload();
        router.push("/notes");
      } else {
        setUploadError(data.message || "Upload failed. Please try again.");
      }
    } catch {
      setUploadError("Something went wrong while uploading. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-20 w-full max-w-5xl px-4 pb-20 text-slate-100 sm:px-6">
      <header className="mb-8 text-center">
        <p className="mb-3 text-sm font-semibold uppercase text-cyan-300">Contribute to NotesHub</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Upload Study Material</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          Share notes, assignments, and course resources with students in your community.
        </p>
      </header>

      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/30 sm:p-8">

        {/* GRID START */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* File Input */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-slate-200">Select File</label>
            <input
              type="file"
              className="mt-2 mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-sm text-slate-200 file:mr-4 file:rounded-md file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:font-medium file:text-cyan-100 hover:file:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="-mt-2 text-xs text-slate-400">{file ? file.name : "Choose a file to share"}</p>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-slate-200">Title</label>
            <input
              type="text"
              placeholder="Enter title"
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Study Type */}
          <div>
            <label className="text-sm font-medium text-slate-200">
              Study Material Type
            </label>
            <select
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              value={studyType}
              onChange={(e) => setStudyType(e.target.value)}
            >
              <option value="">Select Type</option>
              {studyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* University */}
          <div>
            <label className="text-sm font-medium text-slate-200">University/College</label>
            <div ref={universityDropdownRef}>
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
            </div>
          </div>

          {/* Branch */}
          <div ref={branchDropdownRef}>
            <label className="text-sm font-medium text-slate-200">Branch</label>
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
          </div>

          {/* Year */}
          <div>
            <label className="text-sm font-medium text-slate-200"></label>
            <select
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Description (Full Width) */}
          <div className="col-span-2">
            <label className="text-sm font-medium text-slate-200">Description</label>
            <textarea
              placeholder="Enter description"
              className="mt-2 min-h-32 w-full resize-y rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

        </div>
        {/* GRID END */}

        {uploadError && (
          <p role="alert" className="mt-5 rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {uploadError}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-7 w-full rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700"
        >
          {loading ? "Uploading..." : "Upload study material"}
        </button>
      </div>
    </div>
  );
};

export default UploadNote;
