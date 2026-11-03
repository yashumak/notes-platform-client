"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useClickOutside } from "../hooks/useClickOutside";
import LoadingIndicator from "../components/LoadingIndicator";
import { invalidateNotes } from "../notes/queries";

interface UploadResponse {
  success: boolean;
  message?: string;
  uploadUrl?: string;
  uploadToken?: string;
  headers?: Record<string, string>;
  maxFileSizeBytes?: number;
}

interface PendingUpload {
  file: File;
  title: string;
  description: string;
  university: string;
  branch: string;
  subject: string;
  studyType: string;
  year: string;
  visibility: "public" | "private";
}

const pendingUploadDatabase = "noteshub-pending-upload";
const pendingUploadStore = "uploads";

function uploadFileToS3(
  uploadUrl: string,
  file: File,
  headers: Record<string, string>,
  onProgress: (progress: number | null) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const sendAttempt = (attempt: number) => {
      const request = new XMLHttpRequest();
      request.open("PUT", uploadUrl);
      request.timeout = 30 * 60 * 1000;
      Object.entries(headers).forEach(([name, value]) => request.setRequestHeader(name, value));
      request.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 90));
      };
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          onProgress(90);
          resolve();
        } else if (request.status === 403) {
          reject(new Error("The secure upload link expired or storage rejected the request. Please try again."));
        } else if ((request.status === 408 || request.status === 429 || request.status >= 500) && attempt === 0) {
          onProgress(null);
          window.setTimeout(() => sendAttempt(1), 500);
        } else {
          reject(new Error(`Secure storage rejected the upload (HTTP ${request.status}). Check the file format and try again.`));
        }
      };
      request.onerror = () => {
        if (attempt === 0) {
          onProgress(null);
          window.setTimeout(() => sendAttempt(1), 500);
          return;
        }
        reject(new Error(
          "Could not connect to secure file storage after retrying. Check your connection. If you are online, the storage bucket may not allow this website's origin in its CORS settings."
        ));
      };
      request.ontimeout = () => reject(new Error("Upload timed out. Check your connection and try again."));
      request.onabort = () => reject(new Error("Upload was interrupted. Please try again."));
      request.send(file);
    };
    sendAttempt(0);
  });
}

async function completeNoteUpload(uploadToken: string): Promise<UploadResponse> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch("/api/notes/upload/complete", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadToken }),
      });
      const result = (await response.json().catch(() => ({
        success: false,
      }))) as UploadResponse;
      if (response.status >= 500 && attempt === 0) {
        await new Promise<void>((resolve) => window.setTimeout(resolve, 300));
        continue;
      }
      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `The uploaded file could not be saved (HTTP ${response.status}).`
        );
      }
      return result;
    } catch (error) {
      if (!(error instanceof TypeError) || attempt === 1) throw error;
      await new Promise<void>((resolve) => window.setTimeout(resolve, 300));
    }
  }
  throw new Error("The uploaded file could not be saved.");
}

async function requestUploadUrl(body: Record<string, string | number>): Promise<Response> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch("/api/notes/upload/presign", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status >= 500 && attempt === 0) {
        await new Promise<void>((resolve) => window.setTimeout(resolve, 300));
        continue;
      }
      return response;
    } catch (error) {
      if (!(error instanceof TypeError) || attempt === 1) throw error;
      await new Promise<void>((resolve) => window.setTimeout(resolve, 300));
    }
  }
  throw new Error("Could not prepare your file upload.");
}

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
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [university, setUniversity] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [studyType, setStudyType] = useState("");
  const [year, setYear] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  const [uniSearch, setUniSearch] = useState("");
  const [showUniList, setShowUniList] = useState(false);
  const universityDropdownRef = useRef<HTMLDivElement>(null);
  const [branchSearch, setBranchSearch] = useState("");
  const [showBranchList, setShowBranchList] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [showSubjectList, setShowSubjectList] = useState(false);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(universityDropdownRef, () => setShowUniList(false), showUniList);
  useClickOutside(branchDropdownRef, () => setShowBranchList(false), showBranchList);
  useClickOutside(subjectDropdownRef, () => setShowSubjectList(false), showSubjectList);

  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState("");

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
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/engineeringData.json");
        const data = await response.json();
        setUniversities(data.colleges);
        setBranches(data.branches);
        setSubjects(data.subjects ?? []);
      } catch {
        setUniversities([]);
        setBranches([]);
        setSubjects([]);
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
        setSubject(pendingUpload.subject || "");
        setSubjectSearch(pendingUpload.subject || "");
        setStudyType(pendingUpload.studyType);
        setYear(pendingUpload.year);
        setVisibility(pendingUpload.visibility || "public");
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
    if (loading) return;
    if (!file) {
      setUploadError("Please select a file.");
      return;
    }

    setUploadError("");
    setUploadSuccess("");
    setUploadProgress(null);
    setLoading(true);

    try {
      const presignResponse = await requestUploadUrl({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
          title,
          description,
          university,
          branch,
          subject,
          studyType,
          year,
          visibility,
      });

      if (presignResponse.status === 401) {
        try {
          await savePendingUpload({ file, title, description, university, branch, subject, studyType, year, visibility });
          router.replace("/login?redirect=%2Fupload");
        } catch {
          setUploadError("Your browser could not save this file for login. Please try again or sign in in another tab before uploading.");
        }
        return;
      }

      const upload = (await presignResponse.json()) as UploadResponse;
      if (!presignResponse.ok) {
        throw new Error(upload.message || "Could not prepare your file upload.");
      }
      if (!upload.uploadUrl || !upload.uploadToken || !upload.headers) {
        throw new Error("The server returned an invalid upload response.");
      }
      if (upload.maxFileSizeBytes && file.size > upload.maxFileSizeBytes) {
        throw new Error(`This file exceeds the ${Math.floor(upload.maxFileSizeBytes / (1024 * 1024))} MB limit.`);
      }

      await uploadFileToS3(upload.uploadUrl, file, upload.headers, setUploadProgress);
      setUploadProgress(95);

      await completeNoteUpload(upload.uploadToken);
      await invalidateNotes(queryClient);

      await clearPendingUpload();
      setUploadProgress(100);
      setUploadSuccess("Upload complete. Opening your notes...");
      await new Promise<void>((resolve) => window.setTimeout(resolve, 600));
      router.push("/notes");
    } catch (error) {
      setUploadError(
        error instanceof TypeError
          ? "Could not reach NotesHub or secure file storage. Check your connection and retry."
          : error instanceof Error
            ? error.message
            : "Something went wrong while uploading. Please try again."
      );
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
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-200">Select File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.md,.json,.xml,.jpg,.jpeg,.png,.gif,.webp"
              className="mt-2 mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-sm text-slate-200 file:mr-4 file:rounded-md file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:font-medium file:text-cyan-100 hover:file:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setUploadError("");
                setUploadProgress(null);
              }}
            />
            <p className="-mt-2 text-xs text-slate-400">
              {file ? file.name : "Choose a PDF, Office, text, or image file to share"}
            </p>
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

          <div>
            <label className="text-sm font-medium text-slate-200">Who can access this note?</label>
            <select
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              value={visibility}
              onChange={(event) => setVisibility(event.target.value as "public" | "private")}
            >
              <option value="public">Share with the community</option>
              <option value="private">Only me</option>
            </select>
          </div>

          {/* University */}
          <div>
            <label className="text-sm font-medium text-slate-200">University/College</label>
            <div ref={universityDropdownRef} className="relative">
              <input
                type="text"
                value={uniSearch}
                onChange={(e) => {
                  setUniSearch(e.target.value);
                  setUniversity(e.target.value);
                  setShowUniList(true);
                }}
                onFocus={() => setShowUniList(true)}
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 pr-10 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                placeholder="Search university"
              />
              {uniSearch && (
                <button
                  type="button"
                  onClick={() => { setUniSearch(""); setUniversity(""); setShowUniList(false); }}
                  className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Clear university"
                >
                  ✕
                </button>
              )}
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

          <div>
            <label className="text-sm font-medium text-slate-200">Subject</label>
            <div ref={subjectDropdownRef} className="relative">
              <input
                type="text"
                value={subjectSearch}
                onChange={(e) => {
                  setSubjectSearch(e.target.value);
                  setSubject(e.target.value);
                  setShowSubjectList(true);
                }}
                onFocus={() => setShowSubjectList(true)}
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 pr-10 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                placeholder="Search or type subject"
              />
              {subjectSearch && (
                <button
                  type="button"
                  onClick={() => { setSubjectSearch(""); setSubject(""); setShowSubjectList(false); }}
                  className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Clear subject"
                >
                  ✕
                </button>
              )}
              {showSubjectList && subjectSearch.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-slate-600 bg-slate-800 shadow-xl">
                  {subjects
                    .filter((s) =>
                      s.toLowerCase().includes(subjectSearch.toLowerCase())
                    )
                    .map((s, i) => (
                      <li
                        key={i}
                        className="cursor-pointer px-4 py-2 text-slate-200 transition-colors hover:bg-slate-700 hover:text-cyan-200"
                        onClick={() => {
                          setSubjectSearch(s);
                          setSubject(s);
                          setShowSubjectList(false);
                        }}
                      >
                        {s}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          {/* Branch */}
          <div ref={branchDropdownRef} className="relative">
            <label className="text-sm font-medium text-slate-200">Branch</label>
            <div className="relative">
              <input
                type="text"
                value={branchSearch}
                onChange={(e) => {
                  setBranchSearch(e.target.value);
                  setBranch(e.target.value);
                  setShowBranchList(true);
                }}
                onFocus={() => setShowBranchList(true)}
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 pr-10 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                placeholder="Search branch"
              />
              {branchSearch && (
                <button
                  type="button"
                  onClick={() => { setBranchSearch(""); setBranch(""); setShowBranchList(false); }}
                  className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Clear branch"
                >
                  ✕
                </button>
              )}
            </div>
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
          <div className="md:col-span-2">
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
        {uploadSuccess && (
          <p role="status" className="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {uploadSuccess}
          </p>
        )}
        {loading && (
          <div className="mt-5" role="status" aria-live="polite">
            <div className="mb-2 flex justify-between text-sm text-slate-300">
              <span>Uploading securely...</span>
              <span>{uploadProgress === null ? "Progress unavailable" : `${uploadProgress}%`}</span>
            </div>
            <progress
              className="h-2 w-full accent-cyan-400"
              max={100}
              value={uploadProgress ?? undefined}
              aria-label="Upload progress"
            />
          </div>
        )}

        {/* Button */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
          className="mt-7 w-full rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700"
        >
          {loading ? <LoadingIndicator label="Uploading..." compact /> : "Upload study material"}
        </button>
      </div>
    </div>
  );
};

export default UploadNote;
