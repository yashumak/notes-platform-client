"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import LoadingIndicator from "../components/LoadingIndicator";

interface AccountProfile {
  name: string;
  email: string;
  university?: string;
  course?: string;
  year?: string;
  profilePhotoUrl?: string | null;
}

interface UploadedNote {
  _id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize?: number;
  fileUrl: string;
  university?: string;
  course?: string;
  visibility?: "public" | "private";
  studyType?: string;
  year?: number;
  createdAt: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [colleges, setColleges] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [profileOptionsError, setProfileOptionsError] = useState("");
  const [uploadedNotes, setUploadedNotes] = useState<UploadedNote[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notesError, setNotesError] = useState("");
  const [notesRetryCount, setNotesRetryCount] = useState(0);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    university: "",
    course: "",
    year: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [showCollegeList, setShowCollegeList] = useState(false);
  const collegeDropdownRef = useRef<HTMLDivElement>(null);
  const [branchSearch, setBranchSearch] = useState("");
  const [showBranchList, setShowBranchList] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const [profileSaveError, setProfileSaveError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useClickOutside(collegeDropdownRef, () => setShowCollegeList(false), showCollegeList);
  useClickOutside(branchDropdownRef, () => setShowBranchList(false), showBranchList);

  useEffect(() => {
    const loadProfileOptions = async () => {
      try {
        const response = await fetch("/data/engineeringData.json");
        if (!response.ok) throw new Error("Could not load college and branch options.");

        const data: { colleges?: unknown; branches?: unknown } = await response.json();
        if (!Array.isArray(data.colleges) || !Array.isArray(data.branches)) {
          throw new Error("College and branch options are unavailable.");
        }

        setColleges([...new Set(data.colleges.filter((option): option is string => typeof option === "string"))]);
        setBranches([...new Set(data.branches.filter((option): option is string => typeof option === "string"))]);
      } catch (optionsError) {
        setProfileOptionsError(
          optionsError instanceof Error ? optionsError.message : "Could not load college and branch options."
        );
      }
    };

    loadProfileOptions();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadUploadedNotes = async () => {
      try {
        const notesResponse = await fetch("/api/notes/mine", {
          credentials: "include",
          signal: controller.signal,
        });
        if (!notesResponse.ok) {
          throw new Error(`Could not load your uploads (HTTP ${notesResponse.status}).`);
        }
        const notesData: { notes?: UploadedNote[] } = await notesResponse.json();
        if (!Array.isArray(notesData.notes)) {
          throw new Error("The uploads service returned an invalid response.");
        }
        setUploadedNotes(notesData.notes);
      } catch (notesLoadError) {
        if (!controller.signal.aborted) {
          setNotesError(notesLoadError instanceof Error ? notesLoadError.message : "The uploads request failed.");
        }
      } finally {
        if (!controller.signal.aborted) setLoadingNotes(false);
      }
    };

    const loadDashboard = async () => {
      try {
        const requestOptions = {
          credentials: "include" as RequestCredentials,
          signal: controller.signal,
        };
        const profileResponse = await fetch("/api/auth/verify", requestOptions);

        if (profileResponse.status === 401) {
          router.replace("/login");
          return;
        }
        if (!profileResponse.ok) {
          throw new Error(`Could not load your account (HTTP ${profileResponse.status}). Please try again.`);
        }

        const profileData: { isAuthenticated?: boolean; user?: AccountProfile } = await profileResponse.json();
        if (!profileData.isAuthenticated || !profileData.user) {
          router.replace("/login");
          return;
        }

        setProfile(profileData.user);
        setLoading(false);
        void loadUploadedNotes();
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : "Could not load your dashboard.");
        }
      }  finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadDashboard();
    return () => controller.abort();
  }, [router, notesRetryCount]);

  const retryUploadedNotes = () => {
    setNotesError("");
    setLoadingNotes(true);
    setNotesRetryCount((count) => count + 1);
  };

  const openProfileEditor = () => {
    const university = profile?.university ?? "";
    const course = profile?.course ?? "";
    setProfileForm({
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      university,
      course,
      year: profile?.year ?? "",
    });
    setCollegeSearch(university);
    setBranchSearch(course);
    setShowCollegeList(false);
    setShowBranchList(false);
    setProfilePhoto(null);
    setProfileSaveError("");
    setEditingProfile(true);
  };

  const handleProfileSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowCollegeList(false);
    setShowBranchList(false);
    setProfileSaveError("");
    setSavingProfile(true);

    const formData = new FormData();
    Object.entries(profileForm).forEach(([key, value]) => formData.append(key, value));
    if (profilePhoto) formData.append("photo", profilePhoto);

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      const data: { message?: string; errors?: { msg?: string }[]; user?: AccountProfile } = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0]?.msg || "Could not update your profile");
      }
      if (!data.user) throw new Error("The server did not return your updated profile");

      setProfile(data.user);
      setEditingProfile(false);
      window.dispatchEvent(new Event("profile-photo-updated"));
    } catch (uploadError) {
      setProfileSaveError(uploadError instanceof Error ? uploadError.message : "Could not update your profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Could not log out. Please try again.");

      window.dispatchEvent(new Event("auth-state-updated"));
      router.replace("/");
    } catch (logoutFailure) {
      setLogoutError(logoutFailure instanceof Error ? logoutFailure.message : "Could not log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleDeleteNote = async (note: UploadedNote) => {
    if (!window.confirm(`Delete "${note.title}"? This cannot be undone.`)) return;

    setDeletingNoteId(note._id);
    setDeleteError("");

    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const contentType = response.headers.get("content-type") || "";
      const data: { message?: string } | null = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (response.status === 401) {
        router.replace("/");
        return;
      }
      if (!response.ok) {
        if (response.status === 404 && !data) {
          throw new Error("The connected backend does not support note deletion yet. Deploy the latest backend and check the Vercel backend URL.");
        }
        throw new Error(data?.message || "Could not delete note. Please try again.");
      }

      setUploadedNotes((currentNotes) => currentNotes.filter((item) => item._id !== note._id));
    } catch (deleteFailure) {
      setDeleteError(deleteFailure instanceof Error ? deleteFailure.message : "Could not delete note. Please try again.");
    } finally {
      setDeletingNoteId(null);
    }
  };

  const matchingColleges = colleges.filter((college) =>
    college.toLowerCase().includes(collegeSearch.toLowerCase())
  );
  const visibleColleges = matchingColleges.slice(0, 100);
  const matchingBranches = branches.filter((branch) =>
    branch.toLowerCase().includes(branchSearch.toLowerCase())
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 pb-16 pt-28">
        <LoadingIndicator label="Loading your dashboard" className="min-h-64" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 pb-16 pt-28 text-rose-200">
        <p role="alert">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg border border-rose-300/50 px-4 py-2 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-300/10 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          Try again
        </button>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="min-h-screen px-4 pb-20 pt-28 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center gap-5 border-b border-slate-700 pb-8">
          <div className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-visible rounded-full border border-cyan-300/40 bg-cyan-400/10 text-2xl font-bold text-cyan-200">
            {profile.profilePhotoUrl ? (
              <>
                <Image
                  src={profile.profilePhotoUrl}
                  alt={`${profile.name}'s profile`}
                  width={80}
                  height={80}
                  unoptimized
                  className="h-full w-full rounded-full object-cover"
                />
                <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 w-48 -translate-x-1/2 translate-y-2 overflow-hidden rounded-xl border border-slate-600 bg-slate-900 p-1 opacity-0 shadow-2xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <Image
                    src={profile.profilePhotoUrl}
                    alt={`${profile.name}'s profile photo preview`}
                    width={192}
                    height={192}
                    unoptimized
                    className="h-48 w-48 rounded-lg object-cover"
                  />
                </span>
              </>
            ) : (
              profile.name.trim().charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase text-cyan-300">Student account</p>
            <h1 className="mt-1 wrap-break-word text-3xl font-bold text-white">{profile.name}</h1>
            <p className="mt-1 break-all text-slate-400">{profile.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
            <button
              type="button"
              onClick={openProfileEditor}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-cyan-400/50 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              Edit profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-rose-400/40 px-4 py-2.5 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-400/10 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-wait disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Log out"}
            </button>
            {logoutError && <p className="basis-full text-sm text-rose-300" role="alert">{logoutError}</p>}
          </div>
        </header>

        {editingProfile && (
          <div className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto bg-slate-950/80 p-4 sm:items-center" role="presentation">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-profile-title"
              className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-8"
            >
              <h2 id="edit-profile-title" className="text-2xl font-bold text-white">Edit profile</h2>
              <p className="mt-2 text-sm text-slate-400">Update your account and study details.</p>
              <form onSubmit={handleProfileSave} className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile-name" className="text-sm font-medium text-slate-200">Full name</label>
                  <input
                    id="profile-name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    value={profileForm.name}
                    onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
                    className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  />
                </div>
                <div>
                  <label htmlFor="profile-email" className="text-sm font-medium text-slate-200">Email</label>
                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
                    className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="profile-university" className="text-sm font-medium text-slate-200">College / University</label>
                  <div ref={collegeDropdownRef} className="relative">
                    <input
                      id="profile-university"
                      name="university"
                      type="text"
                      required
                      maxLength={200}
                      autoComplete="off"
                      value={collegeSearch}
                      onChange={(event) => {
                        const value = event.target.value;
                        setCollegeSearch(value);
                        setProfileForm({ ...profileForm, university: value });
                        setShowCollegeList(true);
                      }}
                      onFocus={() => setShowCollegeList(true)}
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={showCollegeList}
                      aria-controls="profile-university-options"
                      className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                      placeholder="Search college or university"
                    />
                    {showCollegeList && (
                      <ul
                        id="profile-university-options"
                        role="listbox"
                        className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-600 bg-slate-800 shadow-xl"
                      >
                        {visibleColleges.map((college) => (
                            <li key={college}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={profileForm.university === college}
                                className="w-full px-4 py-2 text-left text-slate-200 transition-colors hover:bg-slate-700 hover:text-cyan-200"
                                onClick={() => {
                                  setCollegeSearch(college);
                                  setProfileForm({ ...profileForm, university: college });
                                  setShowCollegeList(false);
                                }}
                              >
                                {college}
                              </button>
                            </li>
                          ))}
                        {matchingColleges.length === 0 && (
                          <li className="px-4 py-2 text-slate-400">No matches found</li>
                        )}
                        {matchingColleges.length > 100 && (
                          <li className="px-4 py-2 text-xs text-slate-400">Showing the first 100 matches. Type to narrow your search.</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="profile-course" className="text-sm font-medium text-slate-200">Branch / course</label>
                  <div ref={branchDropdownRef} className="relative">
                    <input
                      id="profile-course"
                      name="course"
                      type="text"
                      required
                      maxLength={100}
                      autoComplete="off"
                      value={branchSearch}
                      onChange={(event) => {
                        const value = event.target.value;
                        setBranchSearch(value);
                        setProfileForm({ ...profileForm, course: value });
                        setShowBranchList(true);
                      }}
                      onFocus={() => setShowBranchList(true)}
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={showBranchList}
                      aria-controls="profile-course-options"
                      className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                      placeholder="Search branch or course"
                    />
                    {showBranchList && (
                      <ul
                        id="profile-course-options"
                        role="listbox"
                        className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-600 bg-slate-800 shadow-xl"
                      >
                        {matchingBranches.map((branch) => (
                            <li key={branch}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={profileForm.course === branch}
                                className="w-full px-4 py-2 text-left text-slate-200 transition-colors hover:bg-slate-700 hover:text-cyan-200"
                                onClick={() => {
                                  setBranchSearch(branch);
                                  setProfileForm({ ...profileForm, course: branch });
                                  setShowBranchList(false);
                                }}
                              >
                                {branch}
                              </button>
                            </li>
                          ))}
                        {matchingBranches.length === 0 && (
                          <li className="px-4 py-2 text-slate-400">No matches found</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="profile-year" className="text-sm font-medium text-slate-200">Year</label>
                  <select
                    id="profile-year"
                    name="year"
                    required
                    value={profileForm.year}
                    onChange={(event) => setProfileForm({ ...profileForm, year: event.target.value })}
                    className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  >
                    <option value="">Select year</option>
                    {["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"].map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                    {profileForm.year && !["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"].includes(profileForm.year) && (
                      <option value={profileForm.year}>{profileForm.year}</option>
                    )}
                  </select>
                </div>
                {profileOptionsError && (
                  <p className="sm:col-span-2 text-sm text-amber-300" role="status">{profileOptionsError} You can still enter these values manually.</p>
                )}
                <div className="sm:col-span-2">
                  <label htmlFor="profile-photo" className="text-sm font-medium text-slate-200">Profile photo</label>
                  <input
                    id="profile-photo"
                    name="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => setProfilePhoto(event.target.files?.[0] ?? null)}
                    className="mt-2 block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400/10 file:px-4 file:py-2 file:font-semibold file:text-cyan-200 hover:file:bg-cyan-400/20"
                  />
                  <p className="mt-1 text-xs text-slate-500">JPEG, PNG, or WebP; maximum 5 MB.</p>
                </div>
                {profileSaveError && <p className="sm:col-span-2 text-sm text-rose-300" role="alert">{profileSaveError}</p>}
                <div className="flex justify-end gap-3 sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    disabled={savingProfile}
                    className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-wait disabled:opacity-60"
                  >
                    {savingProfile ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        <section className="border-b border-slate-700 py-8">
          <h2 className="text-xl font-semibold text-white">Study profile</h2>
          <dl className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm text-slate-500">University</dt>
              <dd className="mt-1 wrap-break-word font-medium text-slate-200">{profile.university || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Branch</dt>
              <dd className="mt-1 wrap-break-word font-medium text-slate-200">{profile.course || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Year</dt>
              <dd className="mt-1 font-medium text-slate-200">{profile.year || "Not provided"}</dd>
            </div>
          </dl>
        </section>

        <section className="pt-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-white">My uploaded notes</h2>
              <p className="mt-1 text-sm text-slate-400">{uploadedNotes.length} {uploadedNotes.length === 1 ? "upload" : "uploads"}</p>
            </div>
            <a
              href="/upload"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-cyan-400/50 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              Upload notes
            </a>
          </div>

          {deleteError && <p className="mb-4 text-sm text-rose-300" role="alert">{deleteError}</p>}
          {notesError && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-4">
              <p className="text-sm text-rose-200" role="alert">
                We couldn’t load your uploads. {notesError}
              </p>
              <button
                type="button"
                onClick={retryUploadedNotes}
                className="rounded-lg border border-rose-300/50 px-4 py-2 text-sm font-semibold text-rose-100 transition-colors hover:bg-rose-300/10 focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                Try again
              </button>
            </div>
          )}

          {loadingNotes && (
            <LoadingIndicator
              label="Loading your uploads"
              className="min-h-40 rounded-xl border border-slate-700 bg-slate-900/50"
            />
          )}
          {!loadingNotes && !notesError && uploadedNotes.length === 0 ? (
            <p className="border-t border-slate-700 py-6 text-slate-400">You haven’t uploaded any materials yet.</p>
          ) : !loadingNotes && !notesError && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {uploadedNotes.map((note) => (
                <article key={note._id} className="flex min-w-0 flex-col border-t-2 border-cyan-500 bg-slate-900/60 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="wrap-break-word text-lg font-semibold text-white">{note.title}</h3>
                    <span className="shrink-0 text-xs text-cyan-200">
                      {note.visibility === "private" ? "Private" : note.studyType || "Study material"}
                    </span>
                  </div>
                  {note.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">{note.description}</p>}
                  <dl className="mt-4 space-y-2 text-sm text-slate-400">
                    <div className="wrap-break-word">{note.fileName}</div>
                    {note.university && <div className="wrap-break-word">{note.university}</div>}
                    {note.course && <div className="wrap-break-word">{note.course}{note.year ? ` · ${note.year}` : ""}</div>}
                    {note.fileSize !== undefined && <div>{formatFileSize(note.fileSize)}</div>}
                  </dl>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-700 pt-4">
                    <time className="text-xs text-slate-500" dateTime={note.createdAt}>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </time>
                    <div className="flex items-center gap-4">
                      <a href={note.fileUrl} download={note.fileName} className="text-sm font-semibold text-cyan-300 hover:text-cyan-100 hover:underline">
                        Download
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note)}
                        disabled={deletingNoteId !== null}
                        className="cursor-pointer text-sm font-semibold text-rose-300 hover:text-rose-200 hover:underline disabled:cursor-wait disabled:opacity-60"
                      >
                        {deletingNoteId === note._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
